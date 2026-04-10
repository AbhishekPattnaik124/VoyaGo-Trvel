const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a train reservation confirmation email.
 * @param {string} email - The recipient's email address.
 * @param {object} bookingDetails - Details of the confirmed booking.
 */
const sendReservationEmail = async (email, bookingDetails) => {
    const { trainName, trainNumber, fromStation, toStation, departureTime, pnrNumber, passengerName, totalPrice } = bookingDetails;

    const mailOptions = {
        from: `"Train Booking App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Booking Confirmed: PNR ${pnrNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background-color: #0056b3; color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Your Train Reservation is Confirmed!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello ${passengerName},</p>
                    <p style="font-size: 16px; color: #333;">Thank you for booking with us. Your reservation has been successfully processed. Below are your travel details.</p>
                    <div style="border-top: 2px solid #f0f0f0; margin: 25px 0; padding-top: 25px;">
                        <h2 style="color: #0056b3; margin-top: 0; font-size: 22px;">Reservation Details</h2>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #555;">
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 40%;">PNR Number:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;"><strong>${pnrNumber}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Train:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${trainName} (${trainNumber})</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Route:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${fromStation} to ${toStation}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Departure Time:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${departureTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Total Price:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;"><strong>$${totalPrice.toFixed(2)}</strong></td>
                            </tr>
                        </table>
                    </div>
                    <p style="font-size: 16px; margin-top: 25px;">We wish you a pleasant journey!</p>
                    <p style="font-size: 16px; color: #888;">Sincerely,<br>The Train Booking Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    This is an automated email. Please do not reply.
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Train confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending train email:', error);
    }
};

/**
 * Sends a hotel booking confirmation email.
 * @param {string} email - The recipient's email address.
 * @param {object} bookingDetails - Details of the confirmed booking.
 */
const sendHotelBookingEmail = async (email, bookingDetails) => {
    const { guestName, hotelName, location, checkInDate, checkOutDate, bookingReference, numberOfRooms, numberOfGuests, totalPrice } = bookingDetails;

    const mailOptions = {
        from: `"Hotel Booking App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Hotel Booking Confirmed: ${bookingReference}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background-color: #007bff; color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Your Hotel Booking is Confirmed!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello ${guestName},</p>
                    <p style="font-size: 16px; color: #333;">Thank you for booking with us. Your reservation has been successfully processed. Below are your booking details.</p>
                    <div style="border-top: 2px solid #f0f0f0; margin: 25px 0; padding-top: 25px;">
                        <h2 style="color: #007bff; margin-top: 0; font-size: 22px;">Booking Details</h2>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #555;">
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 40%;">Booking Reference:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;"><strong>${bookingReference}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Hotel Name:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${hotelName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Location:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${location}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Check-in Date:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${new Date(checkInDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Check-out Date:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${new Date(checkOutDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Rooms:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${numberOfRooms}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Guests:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${numberOfGuests}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Total Price:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;"><strong>$${totalPrice.toFixed(2)}</strong></td>
                            </tr>
                        </table>
                    </div>
                    <p style="font-size: 16px; margin-top: 25px;">We look forward to welcoming you!</p>
                    <p style="font-size: 16px; color: #888;">Sincerely,<br>The Hotel Booking Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    This is an automated email. Please do not reply.
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Hotel confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending hotel email:', error);
    }
};

/**
 * Sends a bus booking confirmation email.
 * @param {string} userEmail - The email address of the user.
 * @param {object} busDetails - Details about the bus, including its number.
 * @param {object} routeDetails - Details about the route, including source and destination.
 * @param {object} newBooking - The new booking object with seat number and confirmation ID.
 */
const sendBusBookingEmail = async (userEmail, busDetails, routeDetails, newBooking) => {
    const mailOptions = {
        from: `"Bus Booking App" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Your Bus Ticket is Confirmed! 🚌',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); max-width: 600px; margin: auto; padding: 20px;">
                    <h1 style="color: #2c3e50; font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Booking Confirmed!</h1>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Hello,
                    </p>
                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                        Thank you for your recent booking. Your reservation is confirmed, and your e-ticket is ready.
                    </p>

                    <div style="text-align: left; background-color: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Route:</strong> ${routeDetails.source} to ${routeDetails.destination}</p>
                        <p style="margin: 5px 0;"><strong>Bus Number:</strong> ${busDetails.busNumber}</p>
                        <p style="margin: 5px 0;"><strong>Seat Number:</strong> ${newBooking.seatNumber}</p>
                        <p style="margin: 5px 0;"><strong>Confirmation ID:</strong> ${newBooking.bookingId}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> ${newBooking.status}</p>
                    </div>

                    <a href="#" style="display: inline-block; padding: 12px 25px; background-color: #2ecc71; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View My Ticket</a>

                    <p style="color: #95a5a6; font-size: 14px; margin-top: 20px;">
                        Have a safe and pleasant journey!
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Bus confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending bus email:', error);
    }
};

/**
 * Sends a car rental confirmation email.
 * @param {object} rentalDetails - Details of the confirmed car rental.
 */
const sendCarRentalConfirmation = async (rentalDetails) => {
    const { customerEmail, customerName, pickupDate, returnDate, pickupLocation, returnLocation, car } = rentalDetails;

    // Check if the car object is populated. If not, we can't send a detailed email.
    if (!car) {
        console.error('Car data is not populated for email. Cannot send detailed confirmation.');
        return;
    }

    const mailOptions = {
        from: `"Car Rental App" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: 'Your Car Rental is Confirmed!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background-color: #ff9800; color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Your Car Rental is Confirmed!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello ${customerName},</p>
                    <p style="font-size: 16px; color: #333;">Thank you for choosing our service. Your reservation has been successfully processed.</p>
                    <div style="border-top: 2px solid #f0f0f0; margin: 25px 0; padding-top: 25px;">
                        <h2 style="color: #ff9800; margin-top: 0; font-size: 22px;">Rental Details</h2>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #555;">
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 40%;">Car:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${car.make} ${car.model} (${car.year})</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Booking ID (ATX):</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${rentalDetails.bookingId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Status:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #2ecc71;">${rentalDetails.status}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">License Plate:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${car.licensePlate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Pickup Date:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${new Date(pickupDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Return Date:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${new Date(returnDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Pickup Location:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${pickupLocation}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Return Location:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${returnLocation}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Price Per Day:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">$${car.pricePerDay.toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>
                    <p style="font-size: 16px; margin-top: 25px;">We look forward to seeing you!</p>
                    <p style="font-size: 16px; color: #888;">Sincerely,<br>The Car Rental Team</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    This is an automated email. Please do not reply.
                </div>
            </div>
        `,
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Car rental confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending car rental email:', error);
    }
};

/**
 * Sends a flight booking confirmation email.
 * @param {string} email - The recipient's email address.
 * @param {object} bookingDetails - Details of the confirmed flight booking.
 */
const sendFlightBookingEmail = async (email, bookingDetails) => {
    const { passengerName, flightNumber, origin, destination, departureTime, price } = bookingDetails;

    const mailOptions = {
        from: `"Flight Booking App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Flight Booking Confirmed: ${flightNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #4CAF50; color: white; padding: 25px; text-align: center;">
                    <h1>Your Flight is Confirmed!</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Hello ${passengerName},</p>
                    <p>Your flight has been successfully booked.</p>
                    <div style="margin: 25px 0;">
                        <h3>Booking Details</h3>
                        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                        <p><strong>Status:</strong> <span style="color: #2ecc71;">${bookingDetails.status}</span></p>
                        <p><strong>Flight Number:</strong> ${flightNumber}</p>
                        <p><strong>Route:</strong> ${origin} to ${destination}</p>
                        <p><strong>Departure Time:</strong> ${new Date(departureTime).toLocaleString()}</p>
                        <p><strong>Total Price:</strong> $${price}</p>
                    </div>
                </div>
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending flight email:', error);
    }
};

// Export all functions
const sendTourBookingEmail = async (email, bookingDetails) => {
    const { customerName, tourName, destination, startDate, endDate, price } = bookingDetails;
    const mailOptions = {
        from: `"Tour Booking App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Tour Package Confirmed: ${tourName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background-color: #8e44ad; color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Your Tour Package is Confirmed!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hello ${customerName},</p>
                    <p style="font-size: 16px; color: #333;">Get ready for an adventure! Your <strong>${tourName}</strong> tour package to <strong>${destination}</strong> has been successfully booked.</p>
                    <p style="font-size: 16px; color: #333; font-weight: bold; background: #fdf2e9; padding: 10px; border-left: 4px solid #e67e22;">
                        Great news! We have automatically reserved your Flight, Hotel, Bus transfers, and Rental Car for this tour.
                    </p>
                    <div style="border-top: 2px solid #f0f0f0; margin: 25px 0; padding-top: 25px;">
                        <h2 style="color: #8e44ad; margin-top: 0; font-size: 22px;">Tour Summary</h2>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #555;">
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Destination:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${destination}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Start Date:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${new Date(startDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">End Date:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">${new Date(endDate).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Total Paid:</td>
                                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #2ecc71; font-weight: bold;">$${price}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    This is an automated email. Please do not reply.
                </div>
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Tour confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending tour email:', error);
    }
};

module.exports = { sendReservationEmail, sendHotelBookingEmail, sendBusBookingEmail, sendCarRentalConfirmation, sendFlightBookingEmail, sendTourBookingEmail };
