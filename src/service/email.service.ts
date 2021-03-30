import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import {
  EMAIL_SERVICE,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_FROM
} from '../utilities/secrets';
import logger from '../utilities/logger';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    logger.info('Connected to email server');
  })
  .catch(() => logger.warn('Unable to connect to email server'));

const sendEmail = async (
  emailAddress: string,
  subject: string,
  template: 'resetPassword' | 'successPasswordReset',
  payload?: object
) => {
  try {
    const source = fs.readFileSync(
      path.join(`./src/utilities/emailTemplates/${template}.handlebars`),
      'utf8'
    );
    const compiledTemplate = handlebars.compile(source);
    const options = {
      from: EMAIL_FROM,
      to: emailAddress,
      subject: subject,
      html: compiledTemplate(payload),
    };

    await transporter.sendMail(options);
  } catch (error) {
    logger.warn('Unable to send message');
  }
};

const sendResetPasswordEmail = (
  email: string,
  data: { name: string; link: string }
) => {
  return sendEmail(email, 'Request to Reset Password', 'resetPassword', data);
};

const sendSuccessfulPasswordResetEmail = (email: string) => {
  return sendEmail(email, 'Successful Password Reset', 'successPasswordReset');
};

export { sendResetPasswordEmail, sendSuccessfulPasswordResetEmail };
