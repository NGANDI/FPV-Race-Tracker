package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.Race;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class RaceDao extends AbstractDao<Race> {

	public List<Race> findAllByOwnerUUID(String ownerUUID) {
		try {
			return entityManager.createNamedQuery(Race.FIND_ALL_BY_OWNER, Race.class).setParameter(Race.OWNER_UUID, ownerUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}

	public List<Race> findByCompetitionUUID(String competitionUUID) {
		try {
			return entityManager.createNamedQuery(Race.FIND_ALL_BY_COMPETITION_UUID, Race.class).setParameter(Race.COMPETITION_UUID, competitionUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}
}
