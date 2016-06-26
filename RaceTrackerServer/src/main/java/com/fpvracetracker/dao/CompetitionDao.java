package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.onlineEvent.OnlineEvent;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class CompetitionDao extends AbstractDao<Competition> {

	public List<Competition> findAllByOwnerUUID(String ownerUUID) {
		try {
			return entityManager.createNamedQuery(Competition.FIND_ALL_BY_OWNER, Competition.class).setParameter(Competition.OWNER_UUID, ownerUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}

	public Competition findByOnlineRegistrationKey(String onlineRegistrationKey) {
		try {
			return entityManager.createNamedQuery(Competition.FIND_BY_ONLINE_REGISTRATION_KEY, Competition.class).setParameter(Competition.ONLINE_REGISTRATION_KEY, onlineRegistrationKey)
					.getSingleResult();
		} catch (Exception ex) {
			return null;
		}
	}

	public Competition findByOnlineResultKey(String onlineResultKey) {
		try {
			return entityManager.createNamedQuery(Competition.FIND_BY_ONLINE_RESULT_KEY, Competition.class).setParameter(Competition.ONLINE_RESULT_KEY, onlineResultKey).getSingleResult();
		} catch (Exception ex) {
			return null;
		}
	}
}
