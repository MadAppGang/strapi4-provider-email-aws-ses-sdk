const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");
const { removeUndefined } = require('strapi-utils');

module.exports = {
  provider: "strapi4-provider-email-aws-ses-sdk",
  name: "strapi4-provider-email-aws-ses-sdk",

  init(providerOptions, settings) {
    const ses = new aws.SES({
      apiVersion: "2010-12-01",
      region: providerOptions.region,
    });

    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    return {
      send: async (options) => {
        const { from, to, cc, bcc, replyTo, subject, text, html, attachments, ...rest } = options;

        const msg = {
          from: from || settings.defaultFrom,
          to,
          cc,
          bcc,
          replyTo: replyTo || settings.defaultReplyTo,
          subject,
          text,
          html,
          attachments,
          ...rest,
        };

        await transporter.sendMail(removeUndefined(msg));
      },
    };
  },
};
