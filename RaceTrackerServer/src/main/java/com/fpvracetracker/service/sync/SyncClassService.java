package com.fpvracetracker.service.sync;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.ClassDao;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class SyncClassService {

	@Autowired
	private ClassDao classDao;

	@Transactional
	public void process(Classs[] classes, User user) {
		if (classes == null) {
			return;
		}

		for (int idx = 0; idx < classes.length; idx++) {
			try {
				classes[idx].setOwner(user);
				classDao.update(classes[idx]);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
