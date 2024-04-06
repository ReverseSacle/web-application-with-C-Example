#include<stdio.h>
#include<stdlib.h>

void saveFile(const char* path,const char* content)
{
    FILE* file = fopen(path,"w");
    fprintf(file,"%s",content);
    fclose(file);
}