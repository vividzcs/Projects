//package com.nwuer.test;
//
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileNotFoundException;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.ObjectInputStream;
//import java.io.ObjectOutputStream;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//import org.junit.Test;
//
//import com.nwuer.controller.FileSystemController;
//import com.nwuer.pojo.FileSystem;
//
//public class ObjectTest
//{
//	
//	@Test
//	public void test() throws FileNotFoundException, IOException {
//		FileSystem file = new FileSystem();
//		file.getNowPos().setContent("haha");
//		
//		ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(new File("file/obj.obj")));
//		 
//		oos.writeObject(file);
//		
//		oos.flush();
//		oos.close();
//	}
//	
//	@Test
//	public void test1() throws FileNotFoundException, IOException, ClassNotFoundException {
//		
//		ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("file/obj.obj")));
//		FileSystem file =  (FileSystem) ois.readObject();
//		ois.close();
//		System.out.println(file.getNowPos().getContent());
//		
//	}
//	
//	@Test
//	public void test3() {
//		Map map = new HashMap();
//		Object obj = map.remove("aaa");
//		System.out.println(obj);
//	}
//	
//	@Test
//	public void test4() {
//		Map<String, Integer> map = new HashMap<>();
//		map.put("a",1);
//		map.put("c",1);
//		map.put("b",1);
//		String[] dirs = new String[map.size()];
//		dirs =  map.keySet().toArray(dirs);
//		for(String tmp : dirs) {
//			System.out.println(tmp);
//		}
//	}
//	
//	@Test
//	public void test5() {
//		FileSystemController fileSystemController = new FileSystemController();
//		fileSystemController.showMes();;
//		
//		
//	}
//	
//	@Test
//	public void test6() {
////		String readStr = "cd .";
////		System.out.println(readStr.startsWith("cd ."));
//		String str = "rm a.t";
//		Pattern pattern = Pattern.compile("rm\\s*((\\w*\\.\\w*)|(\\w*))");
//		Matcher matcher = pattern.matcher(str);
//		if(matcher.find()) {
//			System.out.println(matcher.group(1));
//		}else {
//			System.out.println("没找到");
//		}
//	}
//	@Test
//	public void test7() {
//		String readStr = "mkfile a.txt";
////		readStr.matches("mkfile\\s+\\w+\\.\\w+\\s+(\\d*)");
//		Pattern pattern = Pattern.compile("mkfile\\s+(\\w+\\.\\w+)\\s*(\\d*)");
//		Matcher matcher = pattern.matcher(readStr);
//		if(matcher.find()) {
//			System.out.println(matcher.group(1));
//			System.out.println("".equals(matcher.group(2)));
//		}else {
//			System.out.println("没找到");
//		}
//		
//	}
//	
//	@Test
//	public void test8() {
////		System.out.println("cat a.txt".matches("cat\\s+\\w+\\.\\w+"));
//		System.out.println("cd /a".matches("cd\\s+(/.*)"));
//	}
//
//}
