import React from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";

export function ContactSection14() {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "ec18a8ae-ca6a-4222-8a63-44cb238a6220");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully!",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="container mx-auto text-center">
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-4 !text-base lg:!text-2xl"
        >
          Customer Care
        </Typography>
        <Typography
          variant="h1"
          color="blue-gray"
          className="mb-4 !text-3xl lg:!text-5xl"
        >
          We&apos;re Here to Help
        </Typography>
        <Typography className="mb-10 font-normal !text-lg lg:mb-20 mx-auto max-w-3xl !text-gray-500">
          Whether it&apos;s a question about our services, a request for
          technical assistance, or suggestions for improvement, our team is
          eager to hear from you.
        </Typography>
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2 items-center mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m19!1m8!1m3!1d3918.7962627791862!2d106.7166705!3d10.8268979!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x317529f08ade0be1%3A0x5431ebe90ec6bbe8!2zTWluZFggVGVjaG5vbG9neSBTY2hvb2wgMTIyIMSQLiBQaOG6oW0gVsSDbiDEkOG7k25nIEhp4buHcCBCw6xuaCBDaMOhbmggVGjhu6cgxJDhu6ljLCBI4buTIENow60gTWluaCA3MDAwMDA!3m2!1d10.826897899999999!2d106.71667049999999!5e0!3m2!1svi!2s!4v1721982317496!5m2!1svi!2s"
            className="w-full h-full lg:max-h-[510px] "
          ></iframe>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 w-2/3 mx-auto"
          >
            <div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-900"
                >
                  Your Name
                </Typography>
                <div className="w-full">
                  <Input
                    color="gray"
                    size="lg"
                    placeholder="Your Name"
                    name="name"
                    className="focus:border-t-gray-900 w-full"
                    containerProps={{
                      className: "!min-w-full",
                    }}
                    labelProps={{
                      className: "hidden",
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Your Email
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="name@email.com"
                name="email"
                className="focus:border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
                required
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Your Message
              </Typography>
              <Textarea
                rows={6}
                color="gray"
                placeholder="Message"
                name="message"
                className="focus:border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
                required
              />
            </div>
            <Button type="submit" className="w-full" color="gray">
              Send message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection14;
