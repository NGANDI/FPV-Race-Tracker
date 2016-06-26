package com.fpvracetracker.dao;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.TransferRequest;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class TransferRequestDao extends AbstractDao<TransferRequest> {

	public TransferRequest findByVerificationCode(String validationCode) {
		try {
			return entityManager.createNamedQuery(TransferRequest.FIND_BY_VERIFICATION_CODE, TransferRequest.class).setParameter(TransferRequest.VERIFICATION_CODE, validationCode).getSingleResult();
		} catch (Exception ex) {
			return null;
		}
	}
}
