package com.fpvracetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.fpvracetracker.dao.ClassDao;
import com.fpvracetracker.model.frontend.Classs;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class ClassService {

	@Autowired
	private ClassDao classDao;

	public List<Classs> findAllByOwnerUUID(String ownerUUID) {
		return classDao.findAllByOwnerUUID(ownerUUID);
	}

}
