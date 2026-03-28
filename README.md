# Smattire Store

## Overview

Welcome to **Smattire Store**, an open-source fashion e-commerce platform built using **HTML**, **CSS**, and **JavaScript**. This project aims to provide a modern shopping experience for users seeking the latest trends in fashion.

## Features

- **Modern Shopping Interface**: A user-friendly interface that enhances the shopping experience.
- **Product Catalog**: Browse through a wide range of products categorized for easy access.
- **Contact Page**: Get in touch with us for any inquiries or support.
- **About Page**: Learn more about our story, mission, and values.
- **VR Product Visualization**: Experience products in a virtual space, allowing for an immersive shopping experience.

Join us in building a vibrant online community for fashion enthusiasts!

## Daraja (M-Pesa STK Push) Setup

This project now includes optional Daraja API support via Netlify Functions:

- `/.netlify/functions/daraja-stk-push`
- `/.netlify/functions/daraja-callback`

Set the following environment variables in Netlify:

- `MPESA_ENV` (`sandbox` or `production`)
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL` (public URL to `/.netlify/functions/daraja-callback`)
- `MPESA_ACCOUNT_REFERENCE` (optional default; you can set final value later)
- `MPESA_TRANSACTION_DESC` (optional default; you can set final value later)

If Daraja is not configured yet, checkout automatically falls back to WhatsApp flow.
