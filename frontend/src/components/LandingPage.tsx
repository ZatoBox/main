import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GlitchLogo from './landing/GlitchLogo';
import BetaModal from './landing/BetaModal';
import BetaCounter from './landing/BetaCounter';

export default function ZatoBoxBitcoiners() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [referralCode, setReferralCode] = useState('');

    const generateReferralCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReferralCode = generateReferralCode();
        setReferralCode(newReferralCode);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full min-h-screen overflow-x-hidden font-mono text-black bg-white">
            <header className="w-full p-4 border-b-4 border-orange-500 sm:p-6 animate-fade-in">
                <nav className="flex items-center justify-between px-4 mx-auto max-w-7xl">
                    <div className="flex items-center transition-transform duration-200 hover:scale-105">
                        <GlitchLogo width={120} height={40} />
                    </div>
                    <div className="hidden space-x-4 text-base md:flex lg:space-x-8 lg:text-lg">
                        <a href="#access-beta" className="px-2 py-1 transition-all duration-200 hover:bg-orange-500 hover:text-black lg:px-3 hover:scale-105">
                            ACCESS
                        </a>
                        <a href="#demo" className="px-2 py-1 transition-all duration-200 hover:bg-orange-500 hover:text-black lg:px-3 hover:scale-105">
                            DEMO
                        </a>
                        <a href="#pricing" className="px-2 py-1 transition-all duration-200 hover:bg-orange-500 hover:text-black lg:px-3 hover:scale-105">
                            PRICING
                        </a>
                        <a href="#faq" className="px-2 py-1 transition-all duration-200 hover:bg-orange-500 hover:text-black lg:px-3 hover:scale-105">
                            FAQ
                        </a>
                    </div>
                </nav>
            </header>

            <section className="w-full px-4 py-10 sm:py-20 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-start grid-cols-1 gap-8 pt-4 lg:grid-cols-2 lg:gap-16 sm:pt-8">
                        <div className="animate-fade-in-up">
                            <h1 className="mb-4 text-4xl font-black leading-none tracking-tighter text-center sm:text-6xl md:text-8xl sm:mb-6 animate-text-reveal sm:text-left">
                                ACCEPT
                                <br />
                                <span className="px-2 text-black bg-orange-500 animate-paint-orange">BITCOIN</span>
                                <br />
                                WITHOUT NODES OR COMPLICATIONS.
                            </h1>
                            <p className="mb-6 text-base leading-relaxed text-center text-gray-700 sm:text-xl sm:mb-8 animate-fade-in-delay sm:text-left">
                                CONNECT YOUR WALLET AND START ACCEPTING PAYMENTS IN SECONDS.
                            </p>
                            <div className="mb-8 space-y-2 text-sm leading-relaxed text-center sm:text-lg sm:mb-10 animate-fade-in-delay sm:space-y-3 sm:text-left">
                                <div className="animate-typewriter typewriter-delay-1">
                                    {'>'} NO NEED TO RUN A NODE OR MANAGE COMPLEX APIs
                                </div>
                                <div className="animate-typewriter typewriter-delay-2">
                                    {'>'} LIGHTNING AND ON-CHAIN PAYMENTS INTEGRATED
                                </div>
                                <div className="animate-typewriter typewriter-delay-3">
                                    {'>'} COMPATIBLE WITH YOUR FAVORITE WALLETS
                                </div>
                                <div className="animate-typewriter typewriter-delay-4">
                                    {'>'} TOTAL PRIVACY AND SELF-CUSTODY
                                </div>
                            </div>

                            {/* Main CTA Button */}
                            <div className="text-center animate-fade-in-up-delay sm:text-left">
                                <a href="#access-beta">
                                    <Button className="flex items-center justify-center w-full px-6 py-6 text-base font-bold tracking-wider text-black transition-all duration-200 bg-orange-500 border-4 border-orange-500 rounded-none hover:bg-orange-400 sm:text-xl sm:px-12 sm:py-8 hover:scale-105 hover:shadow-lg animate-pulse-slow sm:w-auto">
                                        <span className="text-black">⚡</span>ACCESS BETA
                                    </Button>
                                </a>
                                <p className="mt-4 text-xs font-bold text-orange-500 sm:text-sm animate-text-glow">
                                    {'>'} NO CREDIT CARD. FIRST MONTH FREE. SLOTS BY REGISTRATION
                                    ORDER.
                                </p>
                            </div>
                        </div>
                        <div className="relative animate-fade-in-up-delay">
                            <div className="relative w-full h-64 overflow-hidden bg-orange-500 border-4 border-orange-500 sm:h-96 sm:border-8 animate-float">
                                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black animate-gradient-shift"></div>
                                <div className="absolute w-8 h-8 bg-orange-500 top-2 sm:top-4 left-2 sm:left-4 sm:w-16 sm:h-16 animate-bounce"></div>
                                <div className="absolute w-12 h-12 border-2 border-orange-500 bottom-2 sm:bottom-4 right-2 sm:right-4 sm:w-24 sm:h-24 sm:border-4 animate-pulse"></div>
                                {/* YouTube Video instead of The Mask MP4 */}
                                <div className="absolute inset-0">
                                    <iframe
                                        src="https://www.youtube.com/embed/gA_XNPI7Bbs?si=egdFJDERMXOfFiz8&autoplay=1&mute=1&loop=1&playlist=gA_XNPI7Bbs"
                                        title="ZatoBox Bitcoin POS Demo"
                                        className="object-cover w-full h-full"
                                        frameBorder="0"
                                        allow="autoplay"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            {/* Beta Slots Counter below the video */}
                            <div className="mt-6 sm:mt-8">
                                <BetaCounter />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Benefits Section - Fused from Why ZatoBox and Key Features */}
            <section className="w-full px-4 py-10 text-black bg-orange-500 sm:py-20 sm:px-6 animate-fade-in">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-8 text-3xl font-black text-center sm:text-5xl md:text-7xl sm:mb-16 animate-text-reveal">
                        MAIN BENEFITS
                    </h2>
                    <p className="mb-8 text-lg font-bold text-center sm:text-2xl sm:mb-12 animate-fade-in-delay">
                        "EVERYTHING YOU NEED TO ACCEPT BITCOIN, WITHOUT THE TECHNICAL
                        HEADACHES."
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-8">
                        <div className="p-4 transition-all duration-300 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-left">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [01] NO NODES OR COMPLEX SETUP
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed sm:text-base">
                                {'>'} NO NEED TO RUN A NODE
                                <br />
                                {'>'} NO COMPLEX APIs TO MANAGE
                                <br />
                                {'>'} EVERYTHING WORKS OUT OF THE BOX
                            </p>
                            <p className="text-xs font-bold text-white">
                                SAVE TIME AND AVOID TECHNICAL RISKS
                            </p>
                        </div>

                        <div className="p-4 text-white transition-all duration-300 bg-gray-900 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-right">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [02] LIGHTNING + ON-CHAIN INTEGRATION
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed sm:text-base">
                                {'>'} INSTANT PAYMENTS
                                <br />
                                {'>'} AUTOMATIC QR GENERATION
                                <br />
                                {'>'} OPTIONAL FIAT CONVERSION
                            </p>
                            <p className="text-xs font-bold text-white">
                                RECEIVE PAYMENTS AND MAINTAIN CONTROL OF YOUR BTC
                            </p>
                        </div>

                        <div className="p-4 transition-all duration-300 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-left-delay">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [03] COMPATIBLE WALLETS
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed sm:text-base">
                                {'>'} BLUEWALLET, MUUN, PHOENIX
                                <br />
                                {'>'} BREEZ AND MORE
                                <br />
                                {'>'} USE YOUR FAVORITE WALLET
                            </p>
                            <p className="text-xs font-bold text-white">
                                NO NEED TO CHANGE YOUR EXISTING SETUP
                            </p>
                        </div>

                        <div className="p-4 text-white transition-all duration-300 bg-gray-900 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-right-delay">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [04] SELF-CUSTODY & PRIVACY
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed sm:text-base">
                                {'>'} YOU CONTROL YOUR KEYS
                                <br />
                                {'>'} ZATOBOX DOESN'T HOLD FUNDS
                                <br />
                                {'>'} TOTAL PRIVACY GUARANTEED
                            </p>
                            <p className="text-xs font-bold text-white">
                                YOUR BITCOIN, YOUR CONTROL, YOUR PRIVACY
                            </p>
                        </div>

                        <div className="p-4 transition-all duration-300 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-left-delay-2">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [05] WEB + PHYSICAL POS
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed sm:text-base">
                                {'>'} WORKS ON ANY DEVICE
                                <br />
                                {'>'} TABLET, LAPTOP OR PHONE
                                <br />
                                {'>'} HOSTING AND SUPPORT INCLUDED
                            </p>
                            <p className="text-xs font-bold text-white">
                                FOCUS ON YOUR BUSINESS, NOT ON TECHNICAL ISSUES
                            </p>
                        </div>

                        <div className="p-4 text-white transition-all duration-300 bg-gray-900 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-right-delay-2">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [06] TRANSPARENT PRICING
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed sm:text-base">
                                {'>'} $29.99/MONTH OR $200/YEAR
                                <br />
                                {'>'} NO HIDDEN FEES
                                <br />
                                {' '}
                                <a
                                    href="#pricing"
                                    className="text-orange-400 underline hover:text-orange-300"
                                >
                                    SEE WHAT'S INCLUDED
                                </a>
                            </p>
                            <p className="text-xs font-bold text-white">
                                CLEAR PRICING, NO SURPRISES
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center sm:mt-12 animate-fade-in-up">
                        <a href="#access-beta">
                            <Button className="w-full px-4 py-4 text-base font-black tracking-wider text-orange-500 transition-all duration-200 bg-gray-900 border-4 border-gray-900 rounded-none hover:bg-black sm:text-lg sm:px-8 sm:py-6 hover:scale-105 hover:shadow-lg sm:w-auto">
                                START ACCEPTING BITCOIN WITHOUT COMPLICATIONS
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Demo */}
            <section id="demo" className="w-full px-4 py-10 sm:py-20 sm:px-6">
                <div className="mx-auto text-center max-w-7xl">
                    <h2 className="mb-6 text-3xl font-black leading-none sm:text-5xl md:text-7xl sm:mb-8 animate-text-reveal">
                        SEE HOW
                        <br />
                        <span className="px-2 text-black bg-orange-500 sm:px-4 animate-highlight">
                            SIMPLE IT IS
                        </span>
                    </h2>
                    <p className="mb-8 text-base font-bold sm:text-xl sm:mb-12 animate-fade-in-delay">
                        WATCH THE DEMO AND SEE HOW EASY IT IS TO START ACCEPTING BITCOIN.
                    </p>

                    {/* YouTube Video */}
                    <div className="w-full max-w-4xl mx-auto mb-6 transition-all duration-300 sm:mb-8 animate-float hover:scale-105">
                        <div className="relative w-full aspect-video">
                            <iframe
                                src="https://www.youtube.com/embed/gA_XNPI7Bbs?si=egdFJDERMXOfFiz8"
                                title="ZatoBox Demo Video"
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    <p className="mb-6 text-sm sm:text-base sm:mb-8 animate-fade-in-up">
                        INVOICE SCAN → LIGHTNING QR GENERATION → DASHBOARD WITH BALANCE
                    </p>

                    <a href="#access-beta">
                        <Button className="w-full px-4 py-4 text-base font-black tracking-wider text-black transition-all duration-200 bg-orange-500 border-4 border-orange-500 rounded-none hover:bg-orange-400 sm:text-lg sm:px-8 sm:py-6 hover:scale-105 hover:shadow-lg animate-pulse-slow sm:w-auto">
                            JOIN AND TRY THE BETA FOR FREE
                        </Button>
                    </a>
                </div>
            </section>

            {/* Plans and Pricing */}
            <section
                id="pricing"
                className="w-full px-4 py-10 text-black bg-white sm:py-20 sm:px-6"
            >
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-8 text-3xl font-black text-center sm:text-5xl md:text-7xl sm:mb-16 animate-text-reveal">
                        TRANSPARENT PRICING
                    </h2>

                    <div className="grid max-w-4xl grid-cols-1 gap-4 mx-auto md:grid-cols-2 sm:gap-8">
                        <div className="p-4 text-center text-gray-700 transition-all duration-300 border-4 border-gray-300 sm:p-8 bg-gray-50 hover:scale-105 animate-slide-in-from-left">
                            <h3 className="mb-2 text-lg font-black tracking-wider text-gray-600 sm:text-2xl sm:mb-4">
                                [MONTHLY PLAN]
                            </h3>
                            <div className="mb-2 text-3xl font-black text-gray-700 sm:text-5xl sm:mb-4 animate-number-count">
                                $29.99
                            </div>
                            <div className="mb-4 text-base font-bold text-gray-600 sm:text-lg sm:mb-6">
                                PER MONTH
                            </div>
                            <ul className="mb-6 space-y-1 text-sm text-gray-600 sm:text-base sm:space-y-2 sm:mb-8">
                                <li className="animate-fade-in-list">✓ COMPLETE POS SYSTEM</li>
                                <li className="animate-fade-in-list-delay">
                                    ✓ LIGHTNING & ON-CHAIN PAYMENTS
                                </li>
                                <li className="animate-fade-in-list-delay-2">
                                    ✓ INVENTORY MANAGEMENT
                                </li>
                                <li className="animate-fade-in-list-delay-3">
                                    ✓ OCR INVOICE SCANNING
                                </li>
                                <li className="animate-fade-in-list-delay-4">
                                    ✓ HOSTING INCLUDED
                                </li>
                                <li className="animate-fade-in-list-delay-5">✓ REAL SUPPORT</li>
                                <li className="animate-fade-in-list-delay-6">
                                    ✓ CANCEL ANYTIME
                                </li>
                            </ul>
                            <Button className="w-full px-4 py-4 text-base font-black tracking-wider text-white transition-all duration-200 bg-gray-600 border-4 border-gray-600 rounded-none hover:bg-gray-700 sm:text-lg sm:px-8 sm:py-6 hover:scale-105 hover:shadow-lg">
                                START MONTHLY PLAN
                            </Button>
                            <p className="mt-2 text-xs text-gray-500">
                                ✓ NO CREDIT CARD REQUIRED • ✓ CANCEL ANYTIME
                            </p>
                        </div>

                        <div className="relative p-4 overflow-hidden text-center text-black transition-all duration-300 bg-orange-500 border-4 border-black sm:p-8 hover:scale-105 animate-slide-in-from-right">
                            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-orange-500 transform translate-x-2 -translate-y-1 bg-black rotate-12">
                                BEST VALUE
                            </div>
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                [YEARLY PLAN]
                            </h3>
                            <div className="mb-2 text-3xl font-black sm:text-5xl sm:mb-4 animate-number-count">
                                $200
                            </div>
                            <div className="mb-4 text-base font-bold sm:text-lg sm:mb-6">
                                PER YEAR
                            </div>
                            <div className="p-2 mb-4 text-sm font-bold text-orange-500 bg-black sm:text-base sm:mb-6 animate-bounce">
                                SAVE $159.88
                            </div>
                            <ul className="mb-6 space-y-1 text-sm sm:text-base sm:space-y-2 sm:mb-8">
                                <li className="animate-fade-in-list">
                                    ✓ EVERYTHING FROM MONTHLY PLAN
                                </li>
                                <li className="animate-fade-in-list-delay">
                                    ✓ IMMEDIATE ACCESS
                                </li>
                                <li className="animate-fade-in-list-delay-2">
                                    ✓ PRIORITY SUPPORT
                                </li>
                                <li className="animate-fade-in-list-delay-3">
                                    ✓ CUSTOM INTEGRATIONS
                                </li>
                                <li className="animate-fade-in-list-delay-4">
                                    ✓ FEATURE DEVELOPMENT INPUT
                                </li>
                                <li className="animate-fade-in-list-delay-5">
                                    ✓ NO CREDIT CARD REQUIRED
                                </li>
                            </ul>
                            <Button className="w-full px-4 py-4 text-base font-black tracking-wider text-black transition-all duration-200 bg-white border-4 border-black rounded-none hover:bg-gray-100 sm:text-lg sm:px-8 sm:py-6 hover:scale-105 hover:shadow-lg animate-pulse-slow">
                                ⚡ START YEARLY PLAN
                            </Button>
                            <p className="mt-2 text-xs text-gray-700">
                                ✓ NO CREDIT CARD REQUIRED • ✓ CANCEL ANYTIME
                            </p>
                        </div>
                    </div>

                    {/* Collaborative Development Section */}
                    <div className="max-w-4xl mx-auto mt-8 sm:mt-16 animate-fade-in-up">
                        <div className="p-6 text-center bg-white border-4 border-black sm:p-8">
                            <h3 className="mb-4 text-2xl font-black text-orange-500 sm:text-3xl sm:mb-6 animate-text-glow">
                                [COLLABORATIVE DEVELOPMENT]
                            </h3>
                            <p className="mb-6 text-base font-bold text-black sm:text-lg sm:mb-8">
                                YEARLY PLAN MEMBERS DEVELOP CUSTOM TOOLS TOGETHER WITH OUR TEAM
                            </p>
                            <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2 sm:gap-6">
                                <div className="p-4 text-black bg-white border-2 border-black sm:p-6">
                                    <h4 className="mb-3 text-lg font-black tracking-wider sm:text-xl">
                                        [STEP-BY-STEP PROCESS]
                                    </h4>
                                    <ul className="space-y-2 text-sm sm:text-base">
                                        <li>• 1. DEFINE YOUR NEEDS</li>
                                        <li>• 2. DESIGN THE SOLUTION</li>
                                        <li>• 3. DEVELOP TOGETHER</li>
                                        <li>• 4. TEST & DEPLOY</li>
                                    </ul>
                                </div>
                                <div className="p-4 text-black bg-white border-2 border-black sm:p-6">
                                    <h4 className="mb-3 text-lg font-black tracking-wider sm:text-xl">
                                        [CUSTOM INTEGRATIONS]
                                    </h4>
                                    <ul className="space-y-2 text-sm sm:text-base">
                                        <li>• YOUR SPECIFIC WALLET</li>
                                        <li>• YOUR INVENTORY SYSTEM</li>
                                        <li>• YOUR PAYMENT PROCESSORS</li>
                                        <li>• YOUR ACCOUNTING TOOLS</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-6 text-center sm:mt-8">
                                <p className="mb-6 text-lg font-black text-black sm:text-xl">
                                    YOUR BUSINESS PRIORITIES ARE OUR DEVELOPMENT PRIORITIES
                                </p>
                                <Button className="px-6 py-4 text-base font-black tracking-wider text-black transition-all duration-200 bg-orange-500 border-4 border-orange-500 rounded-none hover:bg-orange-400 sm:text-lg sm:px-8 sm:py-6 hover:scale-105 hover:shadow-lg">
                                    GET YEARLY PLAN FOR COLLABORATIVE DEVELOPMENT
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="max-w-2xl mx-auto mt-8 sm:mt-16 animate-fade-in-up">
                        <div className="p-4 text-center bg-white border-4 border-black sm:p-6">
                            <h3 className="mb-4 text-lg font-bold text-orange-500 sm:text-xl sm:mb-6 animate-text-glow">
                                [NEED HELP?]
                            </h3>
                            <p className="mb-4 text-sm sm:text-base sm:mb-6">
                                IF YOU WANT TO TRY BEFORE BUYING, YOU CAN:
                                <br />
                                • REQUEST A CUSTOM DEMO
                                <br />
                                • CONSULT WITH OUR TEAM
                                <br />• WATCH DEMONSTRATION VIDEOS
                            </p>
                            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
                                <Button className="px-4 py-3 text-sm font-bold tracking-wider text-black transition-all duration-200 bg-orange-500 border-4 border-orange-500 rounded-none hover:bg-orange-400 sm:text-base sm:px-6 sm:py-4 hover:scale-105">
                                    REQUEST DEMO
                                </Button>
                                <Button className="px-4 py-3 text-sm font-bold tracking-wider text-orange-500 transition-all duration-200 bg-black border-4 border-black rounded-none hover:bg-gray-800 sm:text-base sm:px-6 sm:py-4 hover:scale-105">
                                    CONTACT SUPPORT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beta Access Form - Simplified */}
            <section
                id="access-beta"
                className="w-full px-4 py-10 text-black bg-orange-500 sm:py-20 sm:px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <h2 className="mb-8 text-3xl font-black text-center sm:text-5xl md:text-7xl sm:mb-16 animate-text-reveal">
                        [ACCESS BETA]
                    </h2>
                    <div className="p-4 transition-all duration-300 bg-white border-4 border-black sm:p-8 animate-slide-in-from-left hover:shadow-orange-glow">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                                <Input
                                    type="text"
                                    placeholder="NAME OR NICKNAME"
                                    className="p-3 text-sm text-black bg-white border-4 border-orange-500 rounded-none sm:text-base sm:p-4"
                                    required
                                />
                                <Input
                                    type="email"
                                    placeholder="EMAIL"
                                    className="p-3 text-sm text-black bg-white border-4 border-orange-500 rounded-none sm:text-base sm:p-4"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full px-4 py-4 text-base font-bold tracking-wider text-black transition-all duration-200 bg-orange-500 border-4 border-orange-500 rounded-none hover:bg-orange-400 sm:text-lg sm:px-8 sm:py-6 hover:scale-105 hover:shadow-lg animate-pulse-slow"
                            >
                                ⚡ ACCESS BETA
                            </Button>
                        </form>
                        <p className="mt-4 text-xs font-bold text-center text-orange-500 sm:text-sm sm:mt-6 animate-text-glow">
                            {'>'} NO CREDIT CARD. FIRST MONTH FREE. SLOTS BY REGISTRATION
                            ORDER.
                        </p>
                        <p className="mt-2 text-xs font-bold text-center text-gray-600 sm:text-sm">
                            {'>'} WE'LL CONTACT YOU FOR ADDITIONAL DETAILS AFTER REGISTRATION.
                        </p>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="w-full px-4 py-10 text-black bg-orange-500 sm:py-20 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-8 text-3xl font-black text-center sm:text-5xl md:text-7xl sm:mb-16 animate-text-reveal">
                        TRUSTED BY BITCOINERS
                    </h2>

                    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 sm:gap-8 sm:mb-12">
                        <div className="p-4 text-center transition-all duration-300 bg-white border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up">
                            <h3 className="mb-2 text-lg font-black tracking-wider text-black sm:text-2xl sm:mb-4">
                                [OPEN SOURCE]
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                                VERIFY THE TECHNOLOGY YOURSELF
                            </p>
                            <a
                                href="https://github.com/ZatoBox/main"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-orange-500 underline hover:text-orange-400"
                            >
                                VIEW ON GITHUB →
                            </a>
                        </div>

                        <div className="p-4 text-center transition-all duration-300 bg-white border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up-delay">
                            <h3 className="mb-2 text-lg font-black tracking-wider text-black sm:text-2xl sm:mb-4">
                                [COMMUNITY TESTED]
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                                JOIN OUR GROWING COMMUNITY OF BITCOIN BUSINESSES
                            </p>
                            <a
                                href="#"
                                className="font-bold text-orange-500 underline hover:text-orange-400"
                            >
                                JOIN DISCORD →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section
                id="faq"
                className="w-full px-4 py-10 text-black bg-orange-500 sm:py-20 sm:px-6"
            >
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-8 text-3xl font-black text-center sm:text-5xl md:text-7xl sm:mb-16 animate-text-reveal">
                        [FAQ]
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-8">
                        <div className="p-4 transition-all duration-300 border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                DO I NEED TO RUN A NODE?
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base">
                                NO, ZATOBOX HANDLES THE BACKEND AND HOSTING. YOU JUST CONNECT
                                YOUR WALLET.
                            </p>
                        </div>
                        <div className="p-4 text-white transition-all duration-300 bg-gray-900 border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up-delay">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                CAN I USE LIGHTNING AND ON-CHAIN?
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base">
                                YES, BOTH ARE INTEGRATED. CHOOSE THE ONE YOU PREFER.
                            </p>
                        </div>
                        <div className="p-4 transition-all duration-300 border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up-delay-2">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                CAN I WITHDRAW TO MY WALLET?
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base">
                                YES, ZATOBOX DOESN'T HOLD FUNDS, IT JUST FACILITATES THE
                                PROCESS.
                            </p>
                        </div>
                        <div className="p-4 text-white transition-all duration-300 bg-gray-900 border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up-delay-3">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                WHAT WALLETS ARE SUPPORTED?
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base">
                                BLUEWALLET, MUUN, PHOENIX, BREEZ AND OTHER LIGHTNING-COMPATIBLE
                                ONES.
                            </p>
                        </div>
                        <div className="p-4 transition-all duration-300 border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up-delay-4">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                WHAT HAPPENS AFTER THE FREE MONTH?
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base">
                                YOU CAN CONTINUE FOR $29.99/MONTH OR $200/YEAR, OR CANCEL
                                WITHOUT PENALTY.
                            </p>
                        </div>
                        <div className="p-4 text-white transition-all duration-300 bg-gray-900 border-4 border-black sm:p-8 hover:scale-105 animate-fade-in-up-delay-5">
                            <h3 className="mb-2 text-lg font-black tracking-wider sm:text-2xl sm:mb-4">
                                IS IT OPEN SOURCE?
                            </h3>
                            <p className="text-sm leading-relaxed sm:text-base">
                                YES, YOU CAN VIEW THE CODE ON{' '}
                                <a
                                    href="https://github.com/ZatoBox/main"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-orange-400 underline transition-colors duration-200 hover:text-orange-300"
                                >
                                    GITHUB
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full px-4 py-8 border-t-4 border-orange-500 sm:py-12 sm:px-6 animate-fade-in">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8">
                        <div>
                            <div className="flex items-center mb-4 transition-transform duration-200 hover:scale-105">
                                <GlitchLogo width={80} height={30} />
                            </div>
                            <p className="text-sm sm:text-base">
                                MODULAR POS FOR BITCOIN-FRIENDLY BUSINESSES.
                                <br />
                                NO COMPLICATIONS. NO NODES.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-black tracking-wider text-orange-500 sm:text-xl sm:mb-4">
                                [LINKS]
                            </h3>
                            <div className="space-y-1 sm:space-y-2">
                                <a
                                    href="#access-beta"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} ACCESS
                                </a>
                                <a
                                    href="#demo"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} DEMO
                                </a>
                                <a
                                    href="#pricing"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} PRICING
                                </a>
                                <a
                                    href="#faq"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} FAQ
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-black tracking-wider text-orange-500 sm:text-xl sm:mb-4">
                                [SOCIAL]
                            </h3>
                            <div className="space-y-1 sm:space-y-2">
                                <a
                                    href="#"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} TWITTER
                                </a>
                                <a
                                    href="#"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} TIKTOK
                                </a>
                                <a
                                    href="https://github.com/ZatoBox/main"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} GITHUB
                                </a>
                                <a
                                    href="#"
                                    className="block px-2 py-1 text-sm transition-all duration-200 sm:text-base hover:bg-orange-500 hover:text-black hover:scale-105"
                                >
                                    {'>'} LINKEDIN
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 mt-8 text-center border-t-4 border-orange-500 sm:mt-12 sm:pt-8">
                        <p className="text-sm font-bold sm:text-base">
                            © 2025 ZATOBOX - MODULAR POS FOR BITCOINERS
                        </p>
                    </div>
                </div>
            </footer>

            {/* Minimalist Floating CTA */}
            <div className="fixed z-50 bottom-4 sm:bottom-8 right-4 sm:right-8 animate-bounce-in">
                <a href="#access-beta">
                    <Button className="w-16 h-16 text-orange-500 transition-all duration-300 bg-black border-2 border-orange-500 rounded-none hover:bg-gray-800 sm:w-20 sm:h-20 hover:scale-110 hover:shadow-2xl group">
                        <div className="text-2xl font-bold sm:text-3xl group-hover:hidden">
                            ⚡
                        </div>
                        <div className="hidden text-xs font-black leading-tight text-center group-hover:block sm:text-sm">
                            START
                            <br />
                            ACCEPTING
                            <br />
                            BITCOIN
                        </div>
                    </Button>
                </a>
            </div>

            {/* Beta Confirmation Modal */}
            <BetaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                referralCode={referralCode}
            />
        </div>
    );
}
