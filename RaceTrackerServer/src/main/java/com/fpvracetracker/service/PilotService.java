package com.fpvracetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.fpvracetracker.dao.PilotDao;
import com.fpvracetracker.model.frontend.Pilot;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class PilotService {

	@Autowired
	private PilotDao pilotDao;

	public Pilot getPilotByUUID(String uuid) {
		return pilotDao.findById(uuid);
	}

	public List<Pilot> findAllByOwnerUUID(String ownerUUID) {
		return pilotDao.findAllByOwnerUUID(ownerUUID);
	}

}
