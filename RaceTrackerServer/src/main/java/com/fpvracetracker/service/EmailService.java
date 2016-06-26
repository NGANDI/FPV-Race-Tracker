package com.fpvracetracker.service;

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.fpvracetracker.model.TransferRequest;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.onlineRegistration.OnlineRegistration;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class EmailService {

	public void sendTransferAccountEmail(TransferRequest request) {
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);

		String msgBody = "";
		msgBody += "Please copy the following code into the 'Verification Code' field in your FPV Race Tracker and click 'RESTORE ACCOUNT NOW'.\n";
		msgBody += "Verification Code: " + request.getVerificationCode() + "\n\n";
		msgBody += "If you did not request this code, please contact info@fpvracetracker.com immediatly!";

		Message msg = new MimeMessage(session);
		try {
			msg.setFrom(new InternetAddress("info@fpvracetracker.com", "FPV Race Tracker"));
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(request.getUser().getEmail(), request.getUser().getName()));
			msg.setSubject("Transfer Account Request");
			msg.setText(msgBody);
			Transport tr = session.getTransport("smtp");
			tr.connect("smtp.fpvracetracker.com", "info@fpvracetracker.com", "S4jGthGK");
			msg.saveChanges();
			tr.sendMessage(msg, msg.getAllRecipients());
			tr.close();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}

	}

	public void sendRegistrationSuccessEmail(OnlineRegistration registration, Competition competition) {
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);
		DateFormat format = new SimpleDateFormat("MMMM d, yyyy");
		Message msg = new MimeMessage(session);

		String msgBody = "";
		msgBody += "Dear " + registration.getFirstName() + " " + registration.getLastName() + ",\n\n";
		msgBody += "You are successfully registered!\n\n";
		msgBody += "Event:\t" + competition.getDescription() + "\n";
		msgBody += "At:\t" + competition.getLocation() + "\n";
		msgBody += "From:\t" + format.format(competition.getDateFrom()) + "\n";
		msgBody += "To:\t" + format.format(competition.getDateTo()) + "\n\n";

		for (int i = 0; i < registration.classes.size(); i++) {
			msgBody += "Class:\t" + registration.classes.get(i).getName() + "\n";
		}

		msgBody += "\nPlease do not respond to this email, all questions should be sent directly to: " + competition.getOwner().getEmail() + "\n";

		try {
			msg.setFrom(new InternetAddress("info@fpvracetracker.com", "FPV Race Tracker"));
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(registration.getEmail(), registration.getFirstName() + " " + registration.getLastName()));
			msg.setSubject("Registration Confirmation");
			msg.setText(msgBody);
			Transport tr = session.getTransport("smtp");
			tr.connect("smtp.fpvracetracker.com", "info@fpvracetracker.com", "S4jGthGK");
			msg.saveChanges();
			tr.sendMessage(msg, msg.getAllRecipients());
			tr.close();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}

		this.sendRegistrationOwnerNotificationEmail(registration, competition);
	}

	private void sendRegistrationOwnerNotificationEmail(OnlineRegistration registration, Competition competition) {
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);
		DateFormat format = new SimpleDateFormat("MMMM d, yyyy");
		Message msg = new MimeMessage(session);

		String msgBody = "";
		msgBody += "Dear " + competition.getOwner().getName() + ",\n\n";
		msgBody += "A pilot successfully registered to your event!\n\n";
		msgBody += "Event:\t" + competition.getDescription() + "\n";
		msgBody += "At:\t" + competition.getLocation() + "\n";
		msgBody += "From:\t" + format.format(competition.getDateFrom()) + "\n";
		msgBody += "To:\t" + format.format(competition.getDateTo()) + "\n\n";

		msgBody += "Name:\t" + registration.getFirstName() + " " + registration.getLastName() + "\n";
		msgBody += "Alias:\t" + registration.getAlias() + "\n";
		msgBody += "From:\t" + registration.getCountry() + "\n";
		msgBody += "Club:\t" + registration.getClub() + "\n";
		msgBody += "Phone:\t" + registration.getPhone() + "\n";
		msgBody += "Email:\t" + registration.getEmail() + "\n";
		msgBody += "TransponderID:\t" + registration.getDeviceId() + "\n";
		for (int i = 0; i < registration.classes.size(); i++) {
			msgBody += "Class:\t" + registration.classes.get(i).getName() + "\n";
		}

		msgBody += "\nPlease move to your FPV Race Tracker App -> navigate to the 'Events' menu -> select the above event -> click 'Online' -> click 'show registered pilots'.\n";
		msgBody += "Add this pilot to your event.\n";

		try {
			msg.setFrom(new InternetAddress("info@fpvracetracker.com", "FPV Race Tracker"));
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(competition.getOwner().getEmail(), competition.getOwner().getName()));
			msg.setSubject("Pilot Registered");
			msg.setText(msgBody);
			Transport tr = session.getTransport("smtp");
			tr.connect("smtp.fpvracetracker.com", "info@fpvracetracker.com", "S4jGthGK");
			msg.saveChanges();
			tr.sendMessage(msg, msg.getAllRecipients());
			tr.close();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}

	}
}
