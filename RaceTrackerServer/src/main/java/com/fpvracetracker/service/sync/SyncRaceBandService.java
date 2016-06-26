package com.fpvracetracker.service.sync;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.RaceBandDao;
import com.fpvracetracker.model.frontend.RaceBand;
import com.fpvracetracker.model.frontend.User;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class SyncRaceBandService {

	@Autowired
	private RaceBandDao raceBandDao;

	@Transactional
	public void process(RaceBand[] raceBands, User user) {
		if (raceBands == null) {
			return;
		}

		for (int idx = 0; idx < raceBands.length; idx++) {
			try {
				raceBands[idx].setOwner(user);
				raceBandDao.update(raceBands[idx]);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
