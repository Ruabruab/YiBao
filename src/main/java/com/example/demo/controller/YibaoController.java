package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@RestController
public class YibaoController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @GetMapping("/ads_bz_sort")
    public List<Map<String,Object>> ads_bz_sort(){
        String sql="select * from ads_bz_sort";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_renci")
    public List<Map<String,Object>> ads_renci(){
        String sql="select * from ads_renci";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_barmove")
    public List<Map<String,Object>> ads_barmove(){
        String sql="select * from ads_barmove";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_jgdj")
    public List<Map<String,Object>> ads_jgdj(){
        String sql="select * from ads_jgdj";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }

    @GetMapping("/ads_yllb")
    public List<Map<String,Object>> ads_yllb(){
        String sql="select * from ads_yllb";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }

    @GetMapping("/ads_zyrc")
    public List<Map<String,Object>> ads_zyrc(){
        String sql="select * from ads_zyrc";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_age")
    public List<Map<String,Object>> ads_age(){
        String sql="select * from ads_age";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_sum_diqu")
    public List<Map<String,Object>> ads_sum_diqu(){
        String sql="select * from ads_sum_diqu";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_diqu_move")
    public List<Map<String,Object>> ads_diqu_move(){
        String sql="select * from ads_diqu_move";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_xb_bz")
    public List<Map<String,Object>> ads_xb_bz(){
        String sql="select * from ads_xb_bz";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_jsrq_time")
    public List<Map<String,Object>> ads_jsrq_time(){
        String sql="select * from ads_jsrq_time";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_daytime")
    public List<Map<String,Object>> ads_daytime(){
        String sql="select * from ads_daytime";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
    @GetMapping("/ads_zhexian")
    public List<Map<String,Object>> ads_zhexian(){
        String sql="select * from ads_zhexian";
        List<Map<String,Object>> list_maps=jdbcTemplate.queryForList(sql);
        return list_maps;
    }
}
