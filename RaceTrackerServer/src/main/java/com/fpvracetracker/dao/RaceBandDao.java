package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.RaceBand;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class RaceBandDao extends AbstractDao<RaceBand> {

	public List<RaceBand> findAllByOwnerUUID(String ownerUUID) {
		try {
			return entityManager.createNamedQuery(RaceBand.FIND_ALL_BY_OWNER, RaceBand.class).setParameter(RaceBand.OWNER_UUID, ownerUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}

}
