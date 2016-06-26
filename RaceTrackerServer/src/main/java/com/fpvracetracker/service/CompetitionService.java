package com.fpvracetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.fpvracetracker.dao.CompetitionDao;
import com.fpvracetracker.model.frontend.Competition;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class CompetitionService {

	@Autowired
	private CompetitionDao competitionDao;

	public List<Competition> findAllByOwnerUUID(String ownerUUID) {
		return competitionDao.findAllByOwnerUUID(ownerUUID);
	}

}
