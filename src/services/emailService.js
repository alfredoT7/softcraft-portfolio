const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const getEmailTemplate = () => {
    try {
        return fs.readFileSync(
            path.join(__dirname, '..', 'static', 'email-template.html'),
            'utf8'
          );
    } catch (error) {
      console.error('Error al leer la plantilla de correo:', error);
      return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gracias por contactarnos</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #2d3e50;
                  padding: 20px;
                  text-align: center;
              }
              .header img {
                  max-width: 180px;
              }
              .content {
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 5px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .footer {
                  background-color: #f5f5f5;
                  padding: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #666666;
                  border-top: 3px solid #2d3e50;
              }
              h1 {
                  color: #2d3e50;
                  margin-top: 0;
              }
              .contact-info {
                  background-color: #f9f9f9;
                  padding: 15px;
                  border-left: 4px solid #2d3e50;
                  margin: 20px 0;
              }
              .btn {
                  display: inline-block;
                  background-color: #2d3e50;
                  color: #ffffff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 4px;
                  margin-top: 15px;
              }
              .social-icons {
                  margin-top: 15px;
              }
              .social-icons a {
                  display: inline-block;
                  margin: 0 5px;
                  color: #2d3e50;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="../static/softcraft.png" alt="SoftCraft Logo" />
              </div>
              <div class="content">
                  <h1>¡Gracias por contactarnos!</h1>
                  <p>Hola <strong>\${name}</strong>,</p>
                  <p>Estamos muy agradecidos por tu interés en SoftCraft. Hemos recibido tu mensaje y queremos asegurarte que uno de nuestros especialistas lo revisará y se pondrá en contacto contigo en las próximas 24-48 horas.</p>
                  <p>En SoftCraft nos dedicamos a crear soluciones tecnológicas innovadoras y personalizadas para satisfacer las necesidades específicas de nuestros clientes. Estamos ansiosos por conocer más sobre tu proyecto y cómo podemos ayudarte a hacerlo realidad.</p>
                  <div class="contact-info">
                      <p><strong>Nuestros datos de contacto:</strong></p>
                      <p>📧 Email: softcraft2024@gmail.com</p>
                      <p>📞 Teléfono: +591 71486093</p>
                      <p>🌎 País: Bolivia</p>
                      <p>🏙️ Ciudad: Cochabamba</p>
                  </div>
                  <p>Si tienes alguna consulta urgente, no dudes en contactarnos directamente por teléfono o correo electrónico.</p>
                  <a href="#" class="btn">Visita nuestro sitio web</a>
              </div>
              <div class="footer">
                  <p>© 2025 SoftCraft. Todos los derechos reservados.</p>
                  <p>Cochabamba, Bolivia</p>
                  <div class="social-icons">
                      <a href="#">Facebook</a> |
                      <a href="#">Instagram</a> |
                      <a href="#">LinkedIn</a>
                  </div>
                  <p style="font-size: 12px; margin-top: 20px;">Este correo electrónico fue enviado como respuesta a tu solicitud de contacto. Si no has solicitado información, por favor ignora este mensaje.</p>
              </div>
          </div>
      </body>
      </html>`;
    }
  };
  
  const emailSender = async ({ name, email }) => {
    try {
      // Configuración del transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Obtener la plantilla HTML
      let emailTemplate = getEmailTemplate();
      
      // Reemplazar las variables dinámicas
      emailTemplate = emailTemplate.replace(/\${name}/g, name);
  
      const mailOptions = {
        from: `"SoftCraft" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Gracias por contactarnos',
        text: `Hola ${name},
  
  ¡Gracias por contactarnos!
  
  Estamos muy agradecidos por tu interés en SoftCraft. Hemos recibido tu mensaje y queremos asegurarte que uno de nuestros especialistas lo revisará y se pondrá en contacto contigo en las próximas 24-48 horas.
  
  En SoftCraft nos dedicamos a crear soluciones tecnológicas innovadoras y personalizadas para satisfacer las necesidades específicas de nuestros clientes. Estamos ansiosos por conocer más sobre tu proyecto y cómo podemos ayudarte a hacerlo realidad.
  
  Nuestros datos de contacto:
  - Email: softcraft2024@gmail.com
  - Teléfono: +591 71486093
  - País: Bolivia
  - Ciudad: Cochabamba
  
  Si tienes alguna consulta urgente, no dudes en contactarnos directamente.
  
  Saludos cordiales,
  El equipo de SoftCraft`,
        html: emailTemplate
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.messageId);
      return info;
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