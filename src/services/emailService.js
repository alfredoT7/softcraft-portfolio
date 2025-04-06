const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
require('dotenv').config();

const emailSender = async ({ name, email }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SoftCraft" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Gracias por contactarnos',
            text: `Hola ${name},\n\nGracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo en los próximos días.\n\nSaludos cordiales,\nEl equipo de SoftCraft`,
            html: `<p>Hola <strong>${name}</strong>,</p><p>Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo en los próximos días.</p><p>Saludos cordiales,<br>El equipo de SoftCraft</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

const saveMessage = async ({ name, email, message, phone }) => {
    try {
        const newMessage = await prisma.correo.create({
            data: {
                name,
                email,
                message,
                phone,
            },
        });
        await emailSender({ name, email });
        return newMessage;
    } catch (error) {
        console.error('Error al guardar el mensaje en la base de datos:', error);
        throw error;
    }
};

module.exports = {
    saveMessage,
};