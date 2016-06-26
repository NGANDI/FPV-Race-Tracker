package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.Classs;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class ClassDao extends AbstractDao<Classs> {
	public List<Classs> findAllByOwnerUUID(String ownerUUID) {
		try {
			return entityManager.createNamedQuery(Classs.FIND_ALL_BY_OWNER, Classs.class).setParameter(Classs.OWNER_UUID, ownerUUID).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}

}
