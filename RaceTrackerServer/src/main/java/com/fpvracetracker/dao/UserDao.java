package com.fpvracetracker.dao;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.User;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class UserDao extends AbstractDao<User> {

	public User findByEmail(String email) {
		try {
			return entityManager.createNamedQuery(User.FIND_BY_EMAIL, User.class).setParameter(User.EMAIL, email).getSingleResult();
		} catch (Exception ex) {
			return null;
		}
	}
}
