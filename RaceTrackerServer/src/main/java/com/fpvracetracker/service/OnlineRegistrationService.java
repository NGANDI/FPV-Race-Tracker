package com.fpvracetracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.CompetitionDao;
import com.fpvracetracker.dao.OnlineRegistrationDao;
import com.fpvracetracker.model.ServerBaseEntity;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.onlineRegistration.OnlineRegistration;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class OnlineRegistrationService {

	@Autowired
	private CompetitionDao competitionDao;
	@Autowired
	private EmailService emailService;

	@Autowired
	private OnlineRegistrationDao onlineRegistrationDao;

	@Transactional
	public boolean register(OnlineRegistration registration, String onlineRegistrationKey) {

		Competition competition = competitionDao.findByOnlineRegistrationKey(onlineRegistrationKey);

		if (competition == null)
			return false;

		registration.competition = competition;
		registration.uuid = ServerBaseEntity.generateServerUUID();
		onlineRegistrationDao.update(registration);
		emailService.sendRegistrationSuccessEmail(registration, competition);
		return true;
	}

	@Transactional
	public boolean removeClass(String onlineRegistrationUUID, String classUUID) {
		boolean success = false;
		OnlineRegistration onlineRegistration = onlineRegistrationDao.findByUUID(onlineRegistrationUUID);
		if (onlineRegistration == null) {
			return success;
		}
		for (int index = 0; index < onlineRegistration.classes.size(); index++) {
			Classs classs = onlineRegistration.classes.get(index);
			if (classs.uuid.equalsIgnoreCase(classUUID)) {
				onlineRegistration.classes.remove(index);
				success = true;
				break;
			}
		}
		if (onlineRegistration.classes.size() < 1) {
			onlineRegistrationDao.remove(onlineRegistration);
		} else {
			onlineRegistrationDao.update(onlineRegistration);
		}
		return success;
	}

	@Transactional
	public List<Classs> getClassesOfEvent(String onlineRegistrationKey) {
		List<Classs> classes = new ArrayList<Classs>();
		Competition competition = competitionDao.findByOnlineRegistrationKey(onlineRegistrationKey);

		if (competition == null)
			return classes;

		return competition.classes;
	}

	@Transactional
	public List<OnlineRegistration> getPilotsOfEvent(String competitionUUID) {
		List<OnlineRegistration> pilots = onlineRegistrationDao.findByCompetitionUUID(competitionUUID);
		return pilots;
	}

}
