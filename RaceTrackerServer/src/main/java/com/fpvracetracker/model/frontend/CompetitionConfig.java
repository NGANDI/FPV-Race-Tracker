package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "competitionConfigs")
public class CompetitionConfig extends BaseEntity {

	private static final long serialVersionUID = 7710308329603194123L;
	@OneToOne
	public Classs classs;
	public int roundsTraining;
	public int roundsQualifying;
	public int roundsCompetition;
	public String typeTraining;
	public String typeQualifying;
	public String typeCompetition;

	public CompetitionConfig() {
		super();
	}

	public CompetitionConfig(String uuid, Date saved, Date synced, Classs classs, int roundsTraining,
			int roundsQualifying, int roundsCompetition, String typeTraining, String typeQualifying,
			String typeCompetition, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.classs = classs;
		this.roundsTraining = roundsTraining;
		this.roundsQualifying = roundsQualifying;
		this.roundsCompetition = roundsCompetition;
		this.typeTraining = typeTraining;
		this.typeQualifying = typeQualifying;
		this.typeCompetition = typeCompetition;
	}

	public Classs getClasss() {
		return classs;
	}

	public void setClasss(Classs classs) {
		this.classs = classs;
	}

	public int getRoundsTraining() {
		return roundsTraining;
	}

	public void setRoundsTraining(int roundsTraining) {
		this.roundsTraining = roundsTraining;
	}

	public int getRoundsQualifying() {
		return roundsQualifying;
	}

	public void setRoundsQualifying(int roundsQualifying) {
		this.roundsQualifying = roundsQualifying;
	}

	public int getRoundsCompetition() {
		return roundsCompetition;
	}

	public void setRoundsCompetition(int roundsCompetition) {
		this.roundsCompetition = roundsCompetition;
	}

	public String getTypeTraining() {
		return typeTraining;
	}

	public void setTypeTraining(String typeTraining) {
		this.typeTraining = typeTraining;
	}

	public String getTypeQualifying() {
		return typeQualifying;
	}

	public void setTypeQualifying(String typeQualifying) {
		this.typeQualifying = typeQualifying;
	}

	public String getTypeCompetition() {
		return typeCompetition;
	}

	public void setTypeCompetition(String typeCompetition) {
		this.typeCompetition = typeCompetition;
	}

}