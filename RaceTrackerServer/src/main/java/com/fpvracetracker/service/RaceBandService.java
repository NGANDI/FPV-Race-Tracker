package com.fpvracetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.fpvracetracker.dao.RaceBandDao;
import com.fpvracetracker.model.frontend.RaceBand;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class RaceBandService {

	@Autowired
	private RaceBandDao raceBandDao;

	public List<RaceBand> findAllByOwnerUUID(String ownerUUID) {
		return raceBandDao.findAllByOwnerUUID(ownerUUID);
	}

}
