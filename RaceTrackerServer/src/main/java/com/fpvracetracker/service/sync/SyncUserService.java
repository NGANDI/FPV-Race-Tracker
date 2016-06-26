package com.fpvracetracker.service.sync;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.UserDao;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class SyncUserService {

	@Autowired
	private UserDao userDao;

	@Transactional
	public void process(User user) {
		if (user == null) {
			return;
		}
		try {
			userDao.update(user);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
