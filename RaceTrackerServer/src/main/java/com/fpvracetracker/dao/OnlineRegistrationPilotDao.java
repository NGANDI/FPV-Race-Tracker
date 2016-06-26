package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.onlineRegistration.OnlineRegistrationPilot;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class OnlineRegistrationPilotDao extends AbstractDao<OnlineRegistrationPilot> {

	public List<OnlineRegistrationPilot> findByCompetitionUUID(String competitionUUID) {
		try {
			return entityManager.createNamedQuery(OnlineRegistrationPilot.FIND_BY_COMPETITION_UUID, OnlineRegistrationPilot.class)
					.setParameter(OnlineRegistrationPilot.COMPETITION_UUID, competitionUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}
}
