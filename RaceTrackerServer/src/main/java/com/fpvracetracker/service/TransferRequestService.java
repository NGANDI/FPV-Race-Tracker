package com.fpvracetracker.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.TransferRequestDao;
import com.fpvracetracker.model.TransferRequest;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.frontend.Pilot;
import com.fpvracetracker.model.frontend.Race;
import com.fpvracetracker.model.frontend.RaceBand;
import com.fpvracetracker.model.frontend.User;
import com.fpvracetracker.model.response.TransferResponse;
import com.fpvracetracker.model.response.StatusResponse;
import com.fpvracetracker.model.response.StatusResponseTypes;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class TransferRequestService {

	@Autowired
	private UserService userService;
	@Autowired
	private TransferRequestDao syncRequestDao;
	@Autowired
	private PilotService pilotService;
	@Autowired
	private RaceService raceService;
	@Autowired
	private CompetitionService competitionService;
	@Autowired
	private RaceBandService raceBandService;
	@Autowired
	private ClassService classService;
	@Autowired
	private EmailService emailService;

	@Transactional
	public TransferResponse generateTransferResponse(String verificationCode) {
		if (verificationCode == null) {
			return null;
		}
		TransferResponse response = new TransferResponse();
		TransferRequest initialRequest = syncRequestDao.findByVerificationCode(verificationCode);
		if (initialRequest == null || initialRequest.user == null) {
			return null;
		}

		// Hibernate.initialize(....getXXX() ) could replace eager fetch type
		List<Pilot> pilots = pilotService.findAllByOwnerUUID(initialRequest.user.uuid);
		List<Race> races = raceService.findAllByOwnerUUID(initialRequest.user.uuid);
		List<Competition> competitions = competitionService.findAllByOwnerUUID(initialRequest.user.uuid);
		List<RaceBand> raceBands = raceBandService.findAllByOwnerUUID(initialRequest.user.uuid);
		List<Classs> classes = classService.findAllByOwnerUUID(initialRequest.user.uuid);
		List<User> users = new ArrayList<User>();
		users.add(initialRequest.user);

		response.setPilots(pilots);
		response.setRaces(races);
		response.setCompetitions(competitions);
		response.setRaceBands(raceBands);
		response.setClasses(classes);
		response.setUsers(users);

		return response;
	}

	@Transactional
	public StatusResponse generateSyncRequest(String userUUID) {
		StatusResponse response = new StatusResponse();
		User user = userService.getUserByUUID(userUUID);
		if (user == null) {
			response.setStatus(StatusResponseTypes.USER_NOT_FOUND);
			return response;
		}

		TransferRequest syncRequest = new TransferRequest(user);
		syncRequestDao.create(syncRequest);

		System.out.println("SyncCode: " + syncRequest.getVerificationCode());
		response.setStatus(StatusResponseTypes.SUCCESS);

		try {
			emailService.sendTransferAccountEmail(syncRequest);
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(StatusResponseTypes.MAIL_ERROR);
		}

		return response;
	}
}
