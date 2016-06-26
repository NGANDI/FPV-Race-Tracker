package com.fpvracetracker.service.utils;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class UUIDService {

	public static String getFrontendUUID() {
		return (new Date()).getTime() + "" + UUID.randomUUID().toString();
	}

}
