package com.fortune.eyesee.repository;

import com.fortune.eyesee.entity.CheatingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CheatingTypeRepository extends JpaRepository<CheatingType, Integer> {
    Optional<CheatingType> findByCheatingTypeId(Integer cheatingTypeId);
}