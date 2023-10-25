import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    // return this.categoryTree.findTrees();
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.find({
      where: {
        id,
      },
      relations: ['children'],
    });
  }

  findPaths() {
    return this.categoryRepository.query(`
          WITH RECURSIVE storeCategories AS
            (
              SELECT id, name, "parentId", 1 AS depth, name AS path
                FROM category
                WHERE "parentId" IS NULL
              UNION ALL
                SELECT c.id, c.name, c."parentId", sc.depth + 1, CONCAT(sc.path, ' > ', c.name)
                FROM storeCategories AS sc
                         JOIN category AS c ON sc.id = c."parentId"
                    )
            SELECT * FROM storeCategories;
      `);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  // Add Update Category Status
  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
