class Product:
    def __init__(self, id, name, description, price, stock, category, images=None):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.category = category
        self.images = images or []