import QRCode from "qrcode"

export const generateSlip = async (loan) => {
    const tokenNumber = Math.random().toString(36).substring(7)
    const appointmentDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    const officeLocation = "123 Main St, City, Country"

    const qrData = JSON.stringify({
        tokenNumber,
        appointmentDate,
        officeLocation,
        loanId: loan._id,
    })

    const qrCode = await QRCode.toDataURL(qrData)

    return {
        tokenNumber,
        qrCode,
        appointmentDate,
        officeLocation,
    }
}

