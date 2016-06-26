package com.fpvracetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.fpvracetracker.dao.RaceDao;
import com.fpvracetracker.model.frontend.Race;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class RaceService {

	@Autowired
	private RaceDao raceDao;

	public List<Race> findAllByOwnerUUID(String ownerUUID) {
		return raceDao.findAllByOwnerUUID(ownerUUID);
	}

}
