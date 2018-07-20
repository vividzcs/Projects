package com.nwuer.pojo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 这个是存在文件中的对象
 * 里面有Fat表,文件
 * @author vividzc
 */
public class FileSystem implements Serializable{
	private static final long serialVersionUID = 1L;
	
	FileOrFolder root; //根目录
	FileOrFolder nowPos; //当前目录
	FileOrFolder[] fat = new FileOrFolder[128]; //FAT
	
	Map<String,List<Integer>> allItem = new HashMap<>(); //索引表
	
	
	public FileSystem() {
		
		this.root = new FileOrFolder("/",0);
		this.root.setStatus(1);
		this.nowPos = this.root;
		fat[0] = this.root;
		//fat分配
		for(int i=1;i<fat.length;i++) {
			fat[i] = new FileOrFolder(null, -1);
		}
	}


	public FileOrFolder getRoot()
	{
		return root;
	}


	public void setRoot(FileOrFolder root)
	{
		this.root = root;
	}


	public FileOrFolder getNowPos()
	{
		return nowPos;
	}


	public void setNowPos(FileOrFolder nowPos)
	{
		this.nowPos = nowPos;
	}





	public FileOrFolder[] getFat()
	{
		return fat;
	}


	public void setFat(FileOrFolder[] fat)
	{
		this.fat = fat;
	}




	public Map<String, List<Integer>> getAllItem()
	{
		return allItem;
	}


	public void setAllItem(Map<String, List<Integer>> allItem)
	{
		this.allItem = allItem;
	}
	
}
