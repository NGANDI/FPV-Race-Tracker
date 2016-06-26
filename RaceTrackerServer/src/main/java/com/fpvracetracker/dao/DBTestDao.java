package com.fpvracetracker.dao;

import javax.persistence.EntityManager;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class DBTestDao {

	@PersistenceContext
	transient EntityManager entityManager;

	@Transactional
	public int isDbAvailable() {
		try {
			return (int) entityManager.createNativeQuery("SELECT 1 FROM pilots LIMIT 1")
					.getSingleResult();
		} catch (Exception ex) {
			ex.printStackTrace();
			return 0;
		}
	}

}
