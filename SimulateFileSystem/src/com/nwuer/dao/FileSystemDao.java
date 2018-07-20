package com.nwuer.dao;

import java.io.EOFException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.nwuer.pojo.FileOrFolder;
import com.nwuer.pojo.FileSystem;

public class FileSystemDao {
	private String path = "file/"; //磁盘存储路径
	private String name = "file.obj"; //磁盘名
	private FileSystem fileSystem = new FileSystem();
	private static FileSystemDao fileSystemDao;
		
	private FileSystemDao() {
		ObjectInputStream ois = null;
		try {
			File file = new File(path);
			if(!file.exists() ) {
				file.mkdirs();
				File f = new File(path+name);
				if(!f.exists()) {
					f.createNewFile();
				}
			}else {
				ois = new ObjectInputStream(new FileInputStream(file));
				fileSystem =  (FileSystem) ois.readObject();
			}
		}catch(EOFException e) {
			
		}catch (Exception e) {
			e.printStackTrace();
		}finally {
			try {
				if(ois!= null) {
					ois.close();
				}
			}catch(Exception e1) {
				e1.printStackTrace();
			}
		}
		
	}
	
	public static FileSystemDao getFileSystemDao() {
		if(fileSystemDao == null) {
			fileSystemDao =new FileSystemDao(); 
		}
		return fileSystemDao;
	}
	
	/**
	 * 得到根目录
	 * @return
	 */
	public FileOrFolder getRoot() throws ClassNotFoundException, IOException{
		return fileSystem.getRoot();
	}
	
	/**
	 * 将所有保存进文件
	 * @param fileSystem
	 */
	public void save() {
		ObjectOutputStream oos = null;
		try {
			oos = new ObjectOutputStream(new FileOutputStream(new File(path+name)));
			oos.writeObject(fileSystem);
			
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			try {
				if(oos!= null) {
					oos.flush();
					oos.close();
				}
			}catch(Exception e1) {
				e1.printStackTrace();
			}
		}
	}
	
	/**
	 * 
	 * @param folder 当前目录
	 * @param filename 这个包括名和类型  用.隔开
	 */
	public boolean createFile(String filename,Integer type) {
		//从fat中寻找合适的表项来存放
		FileOrFolder[] fat = fileSystem.getFat();
		for(int i=1;i<fat.length;i++) {
			FileOrFolder f = fat[i];
			if(f.getStatus() == -1) {
				//找到
				f.setStatus(1);
				f.setName(filename);
				f.setCreateTime(new Date());
				f.setEditTime(new Date());
				f.setParent(this.fileSystem.getNowPos());
				f.setType(type);
				//挂载
				this.fileSystem.getNowPos().getSons().put(filename, f);
				
				if(this.fileSystem.getAllItem().get(filename) == null) {
					List<Integer> list = new ArrayList<>();
					list.add(i);
					this.fileSystem.getAllItem().put(filename, list);
				}else {
					this.fileSystem.getAllItem().get(filename).add(i);
				}
				System.out.println("made a file "+filename);
				return true;
			}
		}
		System.out.println("内存用完");
		return false;
	}
	
	/**
	 * 改变文件属性
	 * @param name
	 * @param type
	 */
	public void changeType(String name,Integer type) {
		FileOrFolder fileOrFolder = this.fileSystem.getNowPos().getSons().get(name);
		fileOrFolder.setType(type);
	}
	
	/**
	 * 创建文件夹
	 * @param name
	 */
	public boolean mkdir(String name) {
		FileOrFolder[] fat = fileSystem.getFat();
		for(int i=0;i<fat.length; i++) {
			FileOrFolder f = fat[i];
			if(f.getStatus() == -1) {
				f.setCreateTime(new Date());
				f.setEditTime(new Date());
				f.setName(name);
				f.setType(8);
				f.setParent(fileSystem.getNowPos());
				f.setStartNum(i);
				f.setStatus(1);
				//挂载
				this.fileSystem.getNowPos().getSons().put(name, f);
				
				if(this.fileSystem.getAllItem().get(name) == null) {
					List<Integer> list = new ArrayList<>();
					list.add(i);
					this.fileSystem.getAllItem().put(name, list);
				}else {
					this.fileSystem.getAllItem().get(name).add(i);
				}
				System.out.println("made a folder "+name);
				return true;
			}
		}
		System.out.println("内存用完");
		return false;
	}
	/**
	 * 显示目录下的列表
	 */
	public void dir() {
		Map<String,FileOrFolder> list = fileSystem.getNowPos().getSons();
		String[] dirs = new String[list.size()]; 
		dirs = list.keySet().toArray(dirs);
		FileOrFolder tmp;
		if(dirs.length == 0) {
			System.out.println("empty!");
		}else {
			for(String item : dirs) {
				tmp = list.get(item);
				System.out.println(item+"\t" + tmp.getType()+"\t"+tmp.getSize()+"\t"+tmp.getCreateTime()+"\t"+tmp.getEditTime());
			}
		}
		
	}
	/**
	 * 查看文件
	 * @param name
	 */
	public void cat(String name) {
		FileOrFolder file = this.fileSystem.getNowPos().getSons().get(name);
		if(file == null) {
			System.out.println("文件不存在");
		}else {
			System.out.println(file.getContent() == null ? "empty":file.getContent());
		}
	}
	/**
	 * 写文件
	 * @param name
	 * @param content
	 * @param type
	 */
	public void write(String name,String content,Integer type) {
		FileOrFolder file = this.fileSystem.getNowPos().getSons().get(name);
		if(file == null || file.getType() == 1) {
			System.out.println("文件不存在或为只读文件");
		}else {
			if(type == 0) {//覆盖
				file.setContent(content);
				file.setSize(content.length());
			}else if(type == 1) {//追加
				content = file.getContent()+content;
				file.setContent(content);
				file.setSize(content.length());
				file.setEditTime(new Date());
			}
		}
	}
	
	/**
	 * 以绝对路径跳转
	 * @param path
	 */
	public void cdAbsolute(String path) {
		if("/".equals(path)) {
			this.fileSystem.setNowPos(this.fileSystem.getRoot());
			return;
		}
		String[] dirs = path.split("/");
		FileOrFolder root = this.fileSystem.getRoot();
		FileOrFolder tmp = null,now=null;
		for(String dir : dirs) {
			if(!"".equals(dir.trim())) {
				tmp = root.getSons().get(dir);
				if(tmp == null) {
					System.out.println("路径不存在");
					return;
				}else {
					now = tmp;
					root = tmp;
				}
			}
		}
		//
		if(now != null) {
			this.fileSystem.setNowPos(now);
		}else {
			System.out.println("路径错误");
		}
		
	}
	
	/**
	 * 删除文件或目录
	 * @param name
	 */
	public void rm(String name) {
		FileOrFolder fileOrFolder = this.fileSystem.getNowPos().getSons().remove(name);
		if(fileOrFolder == null) {
			System.out.println("找不到文件或目录");
			return;
		}else {
			FileOrFolder[] fat = this.fileSystem.getFat();
			fileOrFolder.setContent(null);
			fileOrFolder.setName(null);
			fileOrFolder.setParent(null);
			fileOrFolder.setSons(null);
			fileOrFolder.setStatus(-1);
			this.fileSystem.getAllItem().remove(fileOrFolder.getName());
		}
	}
	
	/**
	 * 显示当前目录在文件系统的路径
	 * @param now
	 */
	public void pwd(FileOrFolder now) {
		StringBuilder sb = new StringBuilder("/");
		now = now==null ? this.fileSystem.getNowPos() : now;
		if(now == this.fileSystem.getRoot()) {
			System.out.println(sb.toString());
		}else {
			
			while(now != this.fileSystem.getRoot()) {
				sb.insert(0,now.getName());
				sb.insert(0, "/");
				now = now.getParent();
			}
			System.out.println(sb.toString());
		}
	}
	
	/**
	 * 到下一级目录
	 * @param name
	 */
	public void cdNext(String name) {
		FileOrFolder fileOrFolder = this.fileSystem.getNowPos().getSons().get(name);
		if(fileOrFolder == null) {
			System.out.println("找不到文件或目录!!");
			return;
		}else {
			this.fileSystem.setNowPos(fileOrFolder);
		}
	}
	
	/**
	 * 搜索文件或目录
	 * @param name
	 */
	public void search(String name) {
		List<Integer> list = this.fileSystem.getAllItem().get(name);
		FileOrFolder[] fat = this.fileSystem.getFat();
		FileOrFolder tmp;
		if(list == null) {
			System.out.println("搜索无结果!");
			return;
		}
		for(Integer i : list) {
			tmp = fat[i];
			System.out.println(tmp.getName()+"\t"+tmp.getType()+"\t"+getPwd(tmp));
		}
	}
	
	/**
	 * 得到当前目录在文件系统中的路径的字符串
	 * @param now
	 * @return
	 */
	public String getPwd(FileOrFolder now) {
		StringBuilder sb = new StringBuilder("/");
		now = now==null ? this.fileSystem.getNowPos() : now;
		if(now == this.fileSystem.getRoot()) {
			return sb.toString();
		}else {
			
			while(now != this.fileSystem.getRoot()) {
				sb.insert(0,now.getName());
				sb.insert(0, "/");
				now = now.getParent();
			}
			return sb.toString();
		}
	}
	/**
	 * 退出系统
	 */
	public void exit() {
		fileSystemDao.fileSystem.setNowPos(fileSystem.getRoot());
		fileSystemDao.save();
	}

	public FileSystem getFileSystem()
	{
		return fileSystem;
	}

	public void setFileSystem(FileSystem fileSystem)
	{
		this.fileSystem = fileSystem;
	}
	
}

