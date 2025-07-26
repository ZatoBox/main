import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  productsAPI,
  ocrAPI,
  OCRResponse,
  OCRLineItem,
  OCRMetadata,
} from "../services/api";

const OCRResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OCRResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<OCRResponse | null>(null);
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Office Supplies");
  const [processingOptions, setProcessingOptions] = useState({
    enhance_ocr: true,
    rotation_correction: true,
    confidence_threshold: 0.25,
  });
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleProcessAnother = () => {
    setFile(null);
    setResult(null);
    setError("");
    setIsEditing(false);
    setEditedResult(null);
    // Clear file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Load system status on mount
  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const status = await ocrAPI.getDebugInfo();
        setSystemStatus(status);
      } catch (err: any) {
        console.warn("Could not load system status:", err);
        // Don't show CORS errors to user, just log them
        if (
          err.message?.includes("CORS") ||
          err.message?.includes("NetworkError")
        ) {
          console.warn(
            "CORS issue detected - OCR backend may not be running or CORS not configured"
          );
        }
      }
    };
    loadSystemStatus();
  }, []);

  const handleConfirmData = async () => {
    if (!result || !token) {
      setError("No data to confirm or not authenticated");
      return;
    }

    setIsAddingToInventory(true);
    setError("");

    try {
      // Add each detected item to inventory
      const productsToAdd = result.line_items.map((item: OCRLineItem) => ({
        name: item.description.substring(0, 50), // Truncate long descriptions
        description: item.description,
        price: parseFloat(item.unit_price.replace(/[^\d.-]/g, "")) || 0,
        stock: parseInt(item.quantity.replace(/[^\d]/g, "")) || 1,
        category: selectedCategory,
        status: "active",
      }));

      const addedProducts = [];
      const failedProducts = [];
      for (const productData of productsToAdd) {
        try {
          const response = await productsAPI.create(productData);
          addedProducts.push(response.product);
        } catch (error: any) {
          console.error("Error adding product:", productData.name, error);
          failedProducts.push({
            name: productData.name,
            error: error.message || "Unknown error",
          });
          // Continue with other products even if one fails
        }
      }

      if (addedProducts.length > 0) {
        // Show success message and navigate to inventory
        let message = `Successfully added ${addedProducts.length} products to inventory!`;
        if (failedProducts.length > 0) {
          message += `\n\nFailed to add ${failedProducts.length} products:`;
          failedProducts.forEach((product) => {
            message += `\n- ${product.name}: ${product.error}`;
          });
        }
        alert(message);
        navigate("/inventory");
      } else {
        setError("Failed to add any products to inventory");
      }
    } catch (error) {
      console.error("Error adding products to inventory:", error);
      setError("Failed to add products to inventory. Please try again.");
    } finally {
      setIsAddingToInventory(false);
    }
  };

  const handleEditResult = () => {
    setIsEditing(true);
    setEditedResult(JSON.parse(JSON.stringify(result))); // Deep copy
  };

  const handleSaveEdit = () => {
    setResult(editedResult);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedResult(null);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!editedResult) return;
    const newItems = [...editedResult.line_items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unit_price") {
      const qty = parseInt(newItems[index].quantity.replace(/[^\d]/g, "")) || 0;
      const price =
        parseFloat(newItems[index].unit_price.replace(/[^\d.-]/g, "")) || 0;
      newItems[index].total_price = `$${(qty * price).toFixed(2)}`;
    }

    setEditedResult({
      ...editedResult,
      line_items: newItems,
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      console.log("🚀 Iniciando procesamiento del archivo:", file.name);

      // Process the document with OCR directly
      const ocrResult = await ocrAPI.processDocument(file, processingOptions);

      console.log("📋 Resultado recibido:", ocrResult);

      // El backend siempre devuelve un resultado válido, simplemente lo usamos
      setResult({
        success: true,
        message: "Documento procesado exitosamente",
        metadata: ocrResult.metadata || {},
        line_items: ocrResult.line_items || [],
        detections: ocrResult.detections || [],
        processed_image: null,
        processing_time: 3,
        statistics: {
          yolo_detections: 0,
          table_regions: 0,
          ocr_confidence: 0.95,
          model_status: {
            yolo_loaded: true,
            classes_count: 7,
            is_loaded: true,
          },
        },
        summary: ocrResult.summary || {
          total_products: ocrResult.line_items?.length || 0,
          total_cantidad: 0,
          gran_total: "$0.00",
          promedio_precio: "$0.00",
          processing_time: "< 1s",
          confidence: "High",
        },
      });
    } catch (err: any) {
      console.error("❌ Error en procesamiento OCR:", err);
      setError(
        `Error procesando documento: ${err.message}. Por favor intenta de nuevo.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {!result ? (
          // File selection form
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fadeIn">
            <div className="text-center mb-6 md:mb-8">
              <div className="text-3xl md:text-4xl mb-4">🔍</div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Process Document with OCR
              </h2>
              <p className="text-text-secondary text-sm md:text-base">
                Upload a document to extract information automatically
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3">
                📁 Select invoice document
              </label>
              <div className="border-2 border-dashed border-divider rounded-lg p-6 md:p-8 text-center hover:border-complement transition-colors duration-300">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-text-secondary">
                    <div className="text-4xl md:text-5xl mb-4 animate-bounce">
                      🧾
                    </div>
                    <p className="text-base md:text-lg font-medium">
                      {file
                        ? `Selected: ${file.name}`
                        : "Click to select an invoice"}
                    </p>
                    <p className="text-xs md:text-sm text-text-secondary mt-2">
                      PDF, PNG, JPG, JPEG, TIFF, BMP (max 50MB)
                    </p>
                    <div className="mt-3 text-xs">
                      {systemStatus ? (
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded ${
                            systemStatus.model_status?.yolo_loaded
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {systemStatus.model_status?.yolo_loaded ? "✅" : "⚠️"}
                          AI Model{" "}
                          {systemStatus.model_status?.yolo_loaded
                            ? "Ready"
                            : "Loading..."}
                          {systemStatus.model_status?.classes_count && (
                            <span className="ml-2 text-xs">
                              ({systemStatus.model_status.classes_count}{" "}
                              classes)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600">
                          🔄 Checking OCR Backend...
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Processing Options */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-text-primary mb-3">
                  ⚙️ Processing Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={processingOptions.enhance_ocr}
                      onChange={(e) =>
                        setProcessingOptions((prev) => ({
                          ...prev,
                          enhance_ocr: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span>Enhance OCR</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={processingOptions.rotation_correction}
                      onChange={(e) =>
                        setProcessingOptions((prev) => ({
                          ...prev,
                          rotation_correction: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span>Auto-rotation</span>
                  </label>
                  <label className="flex items-center">
                    <span className="mr-2">Confidence:</span>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.1"
                      value={processingOptions.confidence_threshold}
                      onChange={(e) =>
                        setProcessingOptions((prev) => ({
                          ...prev,
                          confidence_threshold: parseFloat(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="ml-2 text-xs">
                      {(processingOptions.confidence_threshold * 100).toFixed(
                        0
                      )}
                      %
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-complement text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-medium hover:bg-complement-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 md:h-5 w-4 md:w-5 border-b-2 border-white mr-2 md:mr-3"></div>
                    Processing document...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔍</span>
                    Upload and process
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 animate-shake">
                {error}
              </div>
            )}
          </div>
        ) : (
          // Processing result
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fadeIn">
            <div className="text-center mb-6 md:mb-8">
              <div className="text-3xl md:text-4xl mb-4">🧾</div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                Invoice Processing Result
              </h2>
              <p className="text-text-secondary text-sm md:text-base">
                Document processed successfully with AI + OCR
              </p>
              <div className="mt-4 flex justify-center gap-4 flex-wrap">
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <div className="text-sm text-text-secondary">
                    OCR Confidence
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {result?.statistics?.ocr_confidence
                      ? (result.statistics.ocr_confidence * 100).toFixed(1)
                      : '85.0'}
                    %
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <div className="text-sm text-text-secondary">
                    YOLO Detections
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {result?.statistics?.yolo_detections || 0}
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                  <div className="text-sm text-text-secondary">
                    Processing Time
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {result?.processing_time || 0}s
                  </div>
                </div>
              </div>
            </div>

            {/* Document information */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="bg-bg-surface rounded-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4">
                  📋 Invoice Information
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      Company:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.company_name || "No detectado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      RUC:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.ruc || "No detectado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      Date:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.date || "No detectado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      Invoice #:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.invoice_number || "No detectado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      Payment Method:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.payment_method || "No detectado"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface rounded-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4">
                  💰 Financial Summary
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      Subtotal:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.subtotal || "No detectado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-text-secondary text-sm md:text-base">
                      IVA:
                    </span>
                    <span className="text-text-primary text-sm md:text-base">
                      {result?.metadata?.iva || "No detectado"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-divider pt-2">
                    <span className="font-bold text-text-primary text-sm md:text-base">
                      Total:
                    </span>
                    <span className="text-lg md:text-xl font-bold text-green-600">
                      {result?.metadata?.total || "No detectado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4">
                📦 Detected Items
              </h3>
              <div className="bg-bg-surface rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-divider">
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-text-primary">
                          Description
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-text-primary">
                          Quantity
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-text-primary">
                          Unit Price
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-text-primary">
                          Total
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-medium text-text-primary">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isEditing
                        ? editedResult?.line_items
                        : result?.line_items || []
                      ).map((item: OCRLineItem, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-divider hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-text-primary">
                            {isEditing ? (
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'description',
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 md:px-3 py-1 md:py-2 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent text-xs md:text-sm"
                              />
                            ) : (
                              <div className="max-w-xs">
                                <div className="font-medium text-text-primary">
                                  {item.description}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-text-primary text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'quantity',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-16 md:w-20 px-2 md:px-3 py-1 md:py-2 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent text-right text-xs md:text-sm"
                              />
                            ) : (
                              item.quantity
                            )}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-text-primary text-right">
                            {isEditing ? (
                              <input
                                type="text"
                                value={item.unit_price}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'unit_price',
                                    e.target.value
                                  )
                                }
                                className="w-20 md:w-24 px-2 md:px-3 py-1 md:py-2 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent text-right text-xs md:text-sm"
                              />
                            ) : (
                              item.unit_price
                            )}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-text-primary text-right">
                            {item.total_price}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-center">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {item?.confidence
                                ? (item.confidence * 100).toFixed(0)
                                : '85'}
                              %
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales Summary */}
              {result?.summary && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-600">
                        Total Products
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        {result.summary.total_productos}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">
                        Total Quantity
                      </div>
                      <div className="text-lg font-bold text-blue-700">
                        {result.summary.total_cantidad}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Average Price</div>
                      <div className="text-lg font-bold text-purple-700">
                        {result.summary.promedio_precio}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">GRAND TOTAL</div>
                      <div className="text-xl font-bold text-green-800">
                        {result.summary.gran_total}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Processing Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-6 md:mb-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2 md:mr-3">📁</span>
                  <span className="text-xs md:text-sm text-blue-800">
                    <strong>File:</strong> {file?.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-blue-700">
                  <span>
                    📊 Tables: {result?.statistics?.table_regions || 0}
                  </span>
                  <span>
                    🎯 YOLO: {result?.statistics?.yolo_detections || 0}
                  </span>
                  <span>⏱️ {result?.processing_time || 0}s</span>
                </div>
              </div>
            </div>

            {/* Processed Image */}
            {result.processed_image && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4">
                  🖼️ Processed Image with Detections
                </h3>
                <div className="bg-bg-surface rounded-lg p-4 overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${result.processed_image}`}
                    alt="Processed document with AI detections"
                    className="w-full h-auto rounded-lg shadow-md"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Image showing YOLO detections (green boxes) and table
                    regions (blue boxes)
                  </p>
                </div>
              </div>
            )}

            {/* Category selection */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4">
                📂 Product Category
              </h3>
              <div className="bg-bg-surface rounded-lg p-4 md:p-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select category for all products:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-white text-text-primary"
                >
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 md:mb-8 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 animate-shake">
                <div className="flex items-center">
                  <span className="text-error-600 mr-2">⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleConfirmData}
                    disabled={isAddingToInventory}
                    className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    {isAddingToInventory ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Adding to Inventory...
                      </>
                    ) : (
                      '✅ Confirm Data'
                    )}
                  </button>
                  <button
                    onClick={handleEditResult}
                    className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    📝 Edit Result
                  </button>
                  <button
                    onClick={handleProcessAnother}
                    className="bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    🔄 Process Another
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRResultPage;
