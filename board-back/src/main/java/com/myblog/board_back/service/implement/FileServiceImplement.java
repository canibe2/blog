package com.myblog.board_back.service.implement;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.myblog.board_back.service.FileService;

@Service
public class FileServiceImplement implements FileService {
    // 업로드가 되지 않으면 C드라이브에 fileUpload 폴더 생성하기
    @Value("${file.path}")
    private String filePath;

    @Value("${file.url}")
    private String fileUrl;

    @Override
    public String upload(MultipartFile file) {

        if (file.isEmpty())

            return null;

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        String saveFileName = uuid + extension;
        String savePath = filePath + saveFileName;

        try {
            file.transferTo(new File(savePath));

        } catch (Exception e) {
            e.printStackTrace();

            return null;
        }

        String url = fileUrl + saveFileName;

        return url;
    }

    @Override
    public Resource getImage(String fileName) {

        Resource resource = null;

        try {

            resource = new UrlResource("file:" + filePath + fileName);

        } catch (Exception e) {
            e.printStackTrace();

            return null;
        }

        return resource;

    }

}
