package com.fpvracetracker.service.sync;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.PilotDao;
import com.fpvracetracker.model.frontend.Pilot;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class SyncPilotService {

	@Autowired
	private PilotDao pilotDao;

	@Transactional
	public void process(Pilot[] pilots, User user) {
		if (pilots == null) {
			return;
		}

		for (int idx = 0; idx < pilots.length; idx++) {
			try {
				pilots[idx].setOwner(user);
				pilotDao.update(pilots[idx]);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
