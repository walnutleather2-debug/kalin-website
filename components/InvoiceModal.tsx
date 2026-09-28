"use client"

import { X, Printer, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Order } from '@/hooks/useOrders'

interface InvoiceModalProps {
    order: Order | null
    isOpen: boolean
    onClose: () => void
}

export default function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
    if (!isOpen || !order) return null

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 no-print">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#510c74] p-2 rounded-lg">
                            <Printer className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Order Invoice</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="hidden sm:flex">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="flex-1 overflow-y-auto p-8 sm:p-12 print:p-0" id="invoice-content">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* Business Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-[#240334] mb-2">MARIYAE KALIN</h1>
                                <p className="text-[#C9A34E] font-medium tracking-widest text-sm mb-4">PREMIUM PRODUCT VARIETY</p>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>Mumbai, Maharashtra, India</p>
                                    <p>Phone: +91 7045932672</p>
                                    <p>Email: contact@mariyae.com</p>
                                </div>
                            </div>
                            <div className="text-right md:text-right w-full md:w-auto">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-semibold text-gray-900">Invoice No:</span> #{order.orderNumber}</p>
                                    <p><span className="font-semibold text-gray-900">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-semibold text-gray-900">Order Ref:</span> {order._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Customer & Shipping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Bill To:</h3>
                                <div className="text-gray-900">
                                    <p className="font-bold text-lg">{order.customerDetails.firstName} {order.customerDetails.lastName}</p>
                                    <p className="text-gray-600">{order.customerDetails.email}</p>
                                    <p className="text-gray-600">{order.customerDetails.phone}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Ship To:</h3>
                                <div className="text-gray-600 space-y-1 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                                    <p className="font-medium text-gray-900">{order.customerDetails.address}</p>
                                    <p>{order.customerDetails.city}, {order.customerDetails.state}</p>
                                    <p>{order.customerDetails.zipCode}, {order.customerDetails.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Item Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-[#510c74]/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                                        <th className="py-4 px-2">Description</th>
                                        <th className="py-4 px-2 text-center">Qty</th>
                                        <th className="py-4 px-2 text-right">Price</th>
                                        <th className="py-4 px-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items.map((item, index) => (
                                        <tr key={index} className="text-gray-900">
                                            <td className="py-5 px-2">
                                                <div className="flex items-center gap-4">
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover print:hidden" />
                                                    <div>
                                                        <p className="font-bold">{item.name}</p>
                                                        <p className="text-xs text-gray-500">{item.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-2 text-center font-medium">{item.quantity}</td>
                                            <td className="py-5 px-2 text-right font-medium">₹{item.price.toLocaleString()}</td>
                                            <td className="py-5 px-2 text-right font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Calculations */}
                        <div className="flex justify-end pt-8">
                            <div className="w-full max-w-xs space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-gray-400 italic">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-100">
                                    <span>GST (18%)</span>
                                    <span className="font-semibold text-gray-900">₹{order.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#510c74]">₹{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-[#fff4df]/30 p-6 rounded-2xl border border-[#C9A34E]/20 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A34E] mb-1">Payment Details</h4>
                                    <p className="text-sm font-medium text-gray-900 capitalize">{order.paymentMethod} Payment</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A34E] mb-1">Status</h4>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-12 space-y-2">
                            <p className="text-gray-900 font-bold italic">Thank you for shopping with Mariyae Kalin!</p>
                            <p className="text-xs text-gray-400">This is a computer-generated invoice and does not require a physical signature.</p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer (Controls) */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 no-print sm:hidden">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handlePrint}>
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
        </div>
    )
}
