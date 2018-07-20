package com.nwuer.service;

import java.io.IOException;
import java.util.Map;

import com.nwuer.dao.FileSystemDao;
import com.nwuer.pojo.FileOrFolder;
import com.nwuer.pojo.FileSystem;

public class FileSystemService {

	private FileSystemDao fileSystemDao = FileSystemDao.getFileSystemDao();
	private static FileSystemService fileSystemService;
	
	private FileSystemService() {}
	
	public static FileSystemService getFileSystemService() {
		if(fileSystemService == null) {
			fileSystemService =  new FileSystemService();
		}
		return fileSystemService;
	}
 
	
	public FileSystem getFileSystem() {
		return this.fileSystemDao.getFileSystem();
	}
	
	
	public void mkdir(String name) {
		this.fileSystemDao.mkdir(name);
	}
	
	public boolean createFile(String filename,Integer type) {
		return this.fileSystemDao.createFile(filename, type);
	}
	
	public void rm(String name) {
		this.fileSystemDao.rm(name);
	}
	
	public void cdNext(String name) {
		this.fileSystemDao.cdNext(name);
	}
	
	public void cdAbsolute(String path) {
		this.fileSystemDao.cdAbsolute(path);
	}
	
	public void pwd() {
		this.fileSystemDao.pwd(null);
	}
	public void cat(String name) {
		this.fileSystemDao.cat(name);
	}
	
	public void changeType(String name,Integer type) {
		this.fileSystemDao.changeType(name, type);
	}
	
	public void write(String name,String content,Integer type) {
		this.fileSystemDao.write(name, content, type);
	}
	
	public void dir() {
		this.fileSystemDao.dir();
	}

	public void exit() {
		this.fileSystemDao.exit();
		System.exit(1);
	}

	public void search(String name) {
		this.fileSystemDao.search(name);
	}
	public void save() {
		this.fileSystemDao.save();;
	}
}
