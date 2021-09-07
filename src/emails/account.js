const mailgun = require("mailgun-js");
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MY_DOMAIN });

const sendWelcomeMessage = (email, name) => {
  const data = {
    from: "m.alibhattissi285@gmail.com",
    to: email,
    subject: "Thanks for joinning in!",
    html: `Welcome to app ${name}. Let me know how you get along with the app`,
  };
  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error);
    }
    console.log(body);
  });
};

const sendDeactivationMessage = (email, name) => {
  const data = {
    from: "m.alibhattissi285@gmail.com",
    to: email,
    subject: "Sorry to see you go!",
    html: `Goodbye ${name}. I hope to see you back sometime soon!`,
  };
  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error);
    }
    console.log(body);
  });
};

module.exports = {
  sendWelcomeMessage,
  sendDeactivationMessage,
};

//const sgMail = require("@sendgrid/mail");
// const sendgridAPIKey =
//   "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";
// sgMail.setApiKey(sendgridAPIKey);

// sgMail.send({
//   to: "m.alibhattissi285@gmail.com",
//   from: "m.alibhattissi285@gmail.com",
//   subject: "First Creation",
//   text: "I hope you will get it",
// });
