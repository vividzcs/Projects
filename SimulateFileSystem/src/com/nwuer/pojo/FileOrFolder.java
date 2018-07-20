package com.nwuer.pojo;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件或目录
 * @author vividzc
 *
 */
public class FileOrFolder implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Map<String,FileOrFolder> sons = new HashMap<>(); //下级目录
	private String name; //文件or目录名
	private Date createTime; //创建时间
	private Date editTime;  //修改时间
	private Integer type;	//第7位	第6位	第5位	第4位	第3位	第2位	第1位	第0位
						//未使用	未使用	未使用	未使用	目录文件	普通文件	系统文件	只读文件
	private Integer size; //文件大小
	private String content; //如果是文件,文件中的内容

	private Integer status;  //标识这个表项的情况
	private Integer startNum; //表项在fat中的起始位置
	
	private FileOrFolder parent; //父级
	
//	public FileOrFolder(String name,Byte type,Integer startNum) {
//		this.name = name;
//		this.type = type;
//		this.startNum = startNum;
//		this.size = 0;
//		this.createTime = new Date();
//		this.status = -1;  //已使用
//	}
	
	public FileOrFolder(String name,Integer startNum) {
		this.name = name;
		this.type = 4; //普通文件
		this.size = 0;
		this.startNum = startNum;
		this.status = -1;
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public Date getCreateTime()
	{
		return createTime;
	}

	public Map<String, FileOrFolder> getSons()
	{
		return sons;
	}

	public void setSons(Map<String, FileOrFolder> sons)
	{
		this.sons = sons;
	}

	public String getContent()
	{
		return content;
	}

	public void setContent(String content)
	{
		this.content = content;
	}

	public void setCreateTime(Date createTime)
	{
		this.createTime = createTime;
	}

	public Date getEditTime()
	{
		return editTime;
	}

	public void setEditTime(Date editTime)
	{
		this.editTime = editTime;
	}

	public Integer getType()
	{
		return type;
	}

	public void setType(Integer type)
	{
		this.type = type;
	}

	public Integer getSize()
	{
		return size;
	}

	public void setSize(Integer size)
	{
		this.size = size;
	}

	public Integer getStatus()
	{
		return status;
	}

	public void setStatus(Integer status)
	{
		this.status = status;
	}

	public Integer getStartNum()
	{
		return startNum;
	}

	public void setStartNum(Integer startNum)
	{
		this.startNum = startNum;
	}

	public FileOrFolder getParent()
	{
		return parent;
	}

	public void setParent(FileOrFolder parent)
	{
		this.parent = parent;
	}
	
}
