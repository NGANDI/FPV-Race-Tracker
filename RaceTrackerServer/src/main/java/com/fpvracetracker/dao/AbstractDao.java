package com.fpvracetracker.dao;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.model.ServerBaseEntity;

public abstract class AbstractDao<T extends ServerBaseEntity> {

	@PersistenceContext
	transient EntityManager entityManager;

    @Transactional(propagation = Propagation.MANDATORY)
	public void detatch(Object o) {
		getEntityManager().detach(o);
	}

    @Transactional(propagation = Propagation.MANDATORY)
	public T findById(String uuid) {
		return (T) getEntityManager().find(getResponseClass(), uuid);
	}

    @Transactional(propagation = Propagation.MANDATORY)
	public List<T> findAll() {
		CriteriaQuery<T> query = getCriteriaQueryFromResponseClass();
		query.from(getResponseClass());
		return getEntityManager().createQuery(query).getResultList();
	}

    @Transactional(propagation = Propagation.MANDATORY)
	public T create(T t) {
		getEntityManager().persist(t);
		return t;
	}

    @Transactional(propagation = Propagation.MANDATORY)
	public T update(T t) {
		return getEntityManager().merge(t);
	}

    @Transactional(propagation = Propagation.MANDATORY)
	public void remove(T t) {
		getEntityManager().remove(getEntityManager().merge(t));
	}

	protected EntityManager getEntityManager() {
		return entityManager;
	}

	private CriteriaQuery<T> getCriteriaQueryFromResponseClass() {
		return getEntityManager().getCriteriaBuilder().createQuery(
				getResponseClass());
	}

	@SuppressWarnings("unchecked")
	private Class<T> getResponseClass() {
		Type t = getClass().getGenericSuperclass();
		ParameterizedType pt = (ParameterizedType) t;
		return (Class<T>) pt.getActualTypeArguments()[0];
	}

}