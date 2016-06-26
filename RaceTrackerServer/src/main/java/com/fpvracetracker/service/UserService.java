package com.fpvracetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.UserDao;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class UserService {

	@Autowired
	private UserDao userDao;

	public User getUserByUUID(String uuid) {
		return userDao.findById(uuid);
	}

	@Transactional
	public boolean isUserAllowed(User user) {
		userDao.update(user);
		return true;
	}
}
