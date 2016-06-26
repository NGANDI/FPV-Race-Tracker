package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.onlineRegistration.OnlineRegistration;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class OnlineRegistrationDao extends AbstractDao<OnlineRegistration> {

	public List<OnlineRegistration> findByCompetitionUUID(String competitionUUID) {
		try {
			return entityManager.createNamedQuery(OnlineRegistration.FIND_BY_COMPETITION_UUID, OnlineRegistration.class).setParameter(OnlineRegistration.COMPETITION_UUID, competitionUUID)
					.getResultList();
		} catch (Exception ex) {
			return null;
		}
	}

	/***
	 * dont know why we need this, built in findById returns duplicate classes
	 * @param uuid
	 * @return
	 */
	public OnlineRegistration findByUUID(String uuid) {
		try {
			return entityManager.createNamedQuery(OnlineRegistration.FIND_BY_UUID, OnlineRegistration.class).setParameter(OnlineRegistration.UUID, uuid).getSingleResult();
		} catch (Exception ex) {
			return null;
		}
	}
}
