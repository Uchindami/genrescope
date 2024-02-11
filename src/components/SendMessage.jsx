import React from "react";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { CiLocationOn, CiMail } from "react-icons/ci";

const SendMessage = () => {
  const [sending, setIsSending] = useState(false);

  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Project: "",
    Message: "",
  });

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const sendEmail = (e) => {
    setIsSending(true);
    e.preventDefault();
    console.log(form);
    const isEmpty = Object.values(form).some((field) => field.trim() === "");

    if (isEmpty) {
      alert("Please fill out all fields.");
    } else {
      emailjs
        .send("service_pndau41", "template_dqyuw6t", form, "T1ejXqRZDRjuJvbpm")
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            alert("Email Sent");
            window.location.reload();
          },
          (err) => {
            console.log("FAILED...", err);
          }
        );
    }
  };

  return (
    <div className="flex flex-col mt-10 items-center justify-center">
      <h3 className="text-2xl m-10 font-semibold">
        Contact Me if you want to revive the project 
      </h3>
      <form className="w-full max-w-lg" onSubmit={sendEmail}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              name="Name"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="email"
              name="Email"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Project
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              name="Project"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Message
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              name="Message"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="items-center">
          <button
            className="bg-accent hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMessage;
