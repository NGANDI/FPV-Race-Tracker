package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.Pilot;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class PilotDao extends AbstractDao<Pilot> {

	public List<Pilot> findAllByOwnerUUID(String ownerUUID) {
		try {
			return entityManager.createNamedQuery(Pilot.FIND_ALL_BY_OWNER, Pilot.class).setParameter(Pilot.OWNER_UUID, ownerUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}
}
