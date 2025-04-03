const emailService = require('../services/emailService');

const saveMessage = async (req, res) => {
    const { name, email, message, phone } = req.body;
    if (!name || !email || !message || !phone) {
        return res.status(400).json({ error: 'Todos los campos (name, email, message, phone) son obligatorios.' });
    }
    try {
        const savedMessage = await emailService.saveMessage({ name, email, message, phone });
        const response = {
            ...savedMessage,
            phone: savedMessage.phone.toString(),
        };
        res.status(201).json({ message: 'Mensaje enviado correctamente', data: response });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
};

module.exports = {
    saveMessage,
};