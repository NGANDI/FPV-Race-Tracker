package com.fpvracetracker.service.sync;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.RaceDao;
import com.fpvracetracker.model.frontend.Race;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class SyncRaceService {

	@Autowired
	private RaceDao raceDao;

	@Transactional
	public void process(Race[] races, User user) {
		if (races == null) {
			return;
		}

		for (int idx = 0; idx < races.length; idx++) {
			try {
				races[idx].setOwner(user);
				races[idx].rounds.forEach((round) -> {
					round.heats.forEach((heat) -> heat.prepairPilots());
				});
				raceDao.update(races[idx]);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
