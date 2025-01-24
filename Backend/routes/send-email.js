const express = require("express");
const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_KEY || "Resend_Key");

router.post("/send-invitation-email", async (req, res) => {
  const { to, subject, html } = req.body;

  console.log("send invite email", to, subject);
  //   console.log("HTML type on server:", typeof html);

  try {
    const { data, error } = await resend.emails.send({
      from: "Sagnik from WorqHat <sagnik@update.worqhat.com>",
      to: [to],
      subject,
      html,
      reply_to: "support@worqhat.com",
    });

    if (error) {
      console.error({ error });
      return res.status(500).send({ error });
    }

    console.log({ data });
    res.send({ message: "Email sent successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An unexpected error occurred" });
  }
});

module.exports = router;
