const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        return newMessage;
    } catch (error) {
        console.error('Error al guardar el mensaje en la base de datos:', error);
        throw error;
    }
};

module.exports = {
    saveMessage,
};