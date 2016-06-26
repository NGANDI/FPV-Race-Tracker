package com.fpvracetracker.service.sync;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.CompetitionDao;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class SyncCompetitionService {

	@Autowired
	private CompetitionDao competitionDao;

	@Transactional
	public void process(Competition[] competitions, User user) {
		if (competitions == null) {
			return;
		}

		for (int idx = 0; idx < competitions.length; idx++) {
			try {
				competitions[idx].setOwner(user);
				competitions[idx].prepairPilots();
				competitionDao.update(competitions[idx]);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
